import express from 'express';
import {
  getAllSongs,
  getSongById,
  uploadSongController,
  deleteSong,
  getRecommendations,
} from '../controllers/songController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSong, uploadSongToCloudinary } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllSongs);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getSongById);
router.post('/upload', protect, uploadSong, uploadSongToCloudinary, uploadSongController);
router.delete('/:id', protect, deleteSong);

export default router;
