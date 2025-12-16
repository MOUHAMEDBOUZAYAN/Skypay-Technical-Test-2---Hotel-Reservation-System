import express from 'express';
import { setRoom, getAllRooms } from '../controllers/roomController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Tous les utilisateurs authentifiés peuvent voir les chambres
router.get('/bookings', verifyToken, getAllRooms);
// Seuls les admins peuvent créer/modifier des chambres
router.post('/', verifyToken, checkRole('admin'), setRoom);

export default router;

