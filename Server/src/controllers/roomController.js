import { setRoomService, getAllRoomsService } from '../services/roomService.js';

export const setRoom = async (req, res) => {
  try {
    const { roomNumber, type, pricePerNight } = req.body;
    const room = await setRoomService(roomNumber, type, pricePerNight);
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const result = await getAllRoomsService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

