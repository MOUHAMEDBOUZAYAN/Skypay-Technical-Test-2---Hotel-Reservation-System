import prisma from '../config/database.js';
import { z } from 'zod';

// Validation schema for dates (only year/month/day matter)
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const bookRoomService = async (userId, roomNumber, checkIn, checkOut) => {
  // Validate dates format
  dateSchema.parse(checkIn);
  dateSchema.parse(checkOut);

  // Parse dates (set to start of day to ignore time)
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);

  // Validate date order
  if (checkInDate >= checkOutDate) {
    throw new Error('Check-out date must be after check-in date');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { userId },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Find room
  const room = await prisma.room.findUnique({
    where: { roomNumber },
  });

  if (!room) {
    throw new Error(`Room with number ${roomNumber} not found`);
  }

  // Check room availability
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      roomId: room.id,
      OR: [
        {
          AND: [
            { checkIn: { lte: checkInDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
        {
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gte: checkOutDate } },
          ],
        },
        {
          AND: [
            { checkIn: { gte: checkInDate } },
            { checkOut: { lte: checkOutDate } },
          ],
        },
      ],
    },
  });

  if (conflictingBookings.length > 0) {
    throw new Error(`Room ${roomNumber} is not available for the selected dates`);
  }

  // Calculate number of nights
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * room.pricePerNight;

  // Check user balance
  if (user.balance < totalPrice) {
    throw new Error(`Insufficient balance. Required: ${totalPrice}, Available: ${user.balance}`);
  }

  // Create booking with snapshots
  const booking = await prisma.$transaction(async (tx) => {
    // Create booking
    const newBooking = await tx.booking.create({
      data: {
        userId: user.id,
        roomId: room.id,
        userBalanceAtBooking: user.balance,
        roomTypeAtBooking: room.type,
        roomPriceAtBooking: room.pricePerNight,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
      },
    });

    // Update user balance
    await tx.user.update({
      where: { id: user.id },
      data: {
        balance: user.balance - totalPrice,
      },
    });

    return newBooking;
  });

  // Fetch booking with relations for response
  const bookingWithDetails = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      user: true,
      room: true,
    },
  });

  return {
    id: bookingWithDetails.id,
    userId: bookingWithDetails.user.userId,
    roomNumber: bookingWithDetails.room.roomNumber,
    userBalanceAtBooking: bookingWithDetails.userBalanceAtBooking,
    roomTypeAtBooking: bookingWithDetails.roomTypeAtBooking,
    roomPriceAtBooking: bookingWithDetails.roomPriceAtBooking,
    checkIn: bookingWithDetails.checkIn,
    checkOut: bookingWithDetails.checkOut,
    totalPrice: bookingWithDetails.totalPrice,
    createdAt: bookingWithDetails.createdAt,
  };
};

