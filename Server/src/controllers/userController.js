import { setUserService, getAllUsersService } from '../services/userService.js';

export const setUser = async (req, res) => {
  try {
    const { userId, balance } = req.body;
    const user = await setUserService(userId, balance);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

