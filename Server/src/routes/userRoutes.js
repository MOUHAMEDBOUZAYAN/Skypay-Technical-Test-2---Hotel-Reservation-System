import express from 'express';
import { setUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/', setUser);
router.get('/', getAllUsers);

export default router;

