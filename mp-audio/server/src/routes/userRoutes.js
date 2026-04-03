import express from 'express';
import {
  getProfile,
  updateProfile,
  toggleLike,
  addToRecent,
  getRecentlyPlayed,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadAvatar, updateProfile);
router.post('/like/:songId', protect, toggleLike);
router.get('/recent', protect, getRecentlyPlayed);
router.post('/recent/:songId', protect, addToRecent);

export default router;
