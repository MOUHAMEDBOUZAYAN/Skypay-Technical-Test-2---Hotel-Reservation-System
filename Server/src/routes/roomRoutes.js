import express from 'express';
import { setRoom, getAllRooms } from '../controllers/roomController.js';

const router = express.Router();

router.post('/', setRoom);
router.get('/bookings', getAllRooms);

export default router;

