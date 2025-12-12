import express from 'express';
import { bookRoom } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', bookRoom);

export default router;

