import prisma from '../config/database.js';
import { RoomType } from '@prisma/client';

export const setRoomService = async (roomNumber, type, pricePerNight) => {
  // Validate type
  if (!Object.values(RoomType).includes(type)) {
    throw new Error(`Invalid room type. Must be one of: ${Object.values(RoomType).join(', ')}`);
  }

  // Validate price
  if (!pricePerNight || pricePerNight <= 0) {
    throw new Error('Price per night must be a positive number');
  }

  // Upsert room (create if not exists, update if exists)
  const room = await prisma.room.upsert({
    where: { roomNumber },
    update: {
      type,
      pricePerNight,
    },
    create: {
      roomNumber,
      type,
      pricePerNight,
    },
  });

  return room;
};

export const getAllRoomsService = async () => {
  const rooms = await prisma.room.findMany({
    include: {
      bookings: {
        orderBy: {
          createdAt: 'desc', // Newest to oldest
        },
        include: {
          user: true,
        },
      },
    },
  });

  // Format response to show bookings with snapshots
  return rooms.map(room => ({
    id: room.id,
    roomNumber: room.roomNumber,
    type: room.type,
    pricePerNight: room.pricePerNight,
    bookings: room.bookings.map(booking => ({
      id: booking.id,
      userId: booking.user.userId,
      userBalanceAtBooking: booking.userBalanceAtBooking,
      roomTypeAtBooking: booking.roomTypeAtBooking,
      roomPriceAtBooking: booking.roomPriceAtBooking,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
    })),
  }));
};

