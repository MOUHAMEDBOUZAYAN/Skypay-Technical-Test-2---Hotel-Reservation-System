import { bookRoomService } from '../services/bookingService.js';

export const bookRoom = async (req, res) => {
  try {
    const { userId, roomNumber, checkIn, checkOut } = req.body;
    const booking = await bookRoomService(userId, roomNumber, checkIn, checkOut);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

