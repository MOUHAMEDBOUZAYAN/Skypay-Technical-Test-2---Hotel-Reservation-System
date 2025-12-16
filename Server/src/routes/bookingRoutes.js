import express from 'express';
import { bookRoom } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Tous les utilisateurs authentifiés peuvent faire des réservations
router.post('/', verifyToken, bookRoom);

export default router;

