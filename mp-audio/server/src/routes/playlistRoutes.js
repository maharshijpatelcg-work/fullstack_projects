import express from 'express';
import {
  getMyPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  addRemoveSong,
  deletePlaylist,
} from '../controllers/playlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyPlaylists);
router.get('/:id', protect, getPlaylistById);
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.put('/:id/songs', protect, addRemoveSong);
router.delete('/:id', protect, deletePlaylist);

export default router;
