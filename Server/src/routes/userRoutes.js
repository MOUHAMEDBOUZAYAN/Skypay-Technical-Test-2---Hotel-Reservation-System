import express from 'express';
import { setUser, getAllUsers } from '../controllers/userController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Tous les utilisateurs authentifiés peuvent voir les utilisateurs
router.get('/', verifyToken, getAllUsers);
// Seuls les admins peuvent créer/modifier des utilisateurs
router.post('/', verifyToken, checkRole('admin'), setUser);

export default router;

