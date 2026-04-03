import Playlist from '../models/Playlist.js';
import User from '../models/User.js';

export const getMyPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs', 'title artist coverImage duration')
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ playlists });
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('owner', 'name avatar');

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    res.json({ playlist });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Playlist name is required');
    }

    const playlist = await Playlist.create({
      name,
      description: description || '',
      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: playlist._id },
    });

    res.status(201).json({ playlist });
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this playlist');
    }

    const { name, description, coverImage, isPublic } = req.body;

    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (coverImage !== undefined) playlist.coverImage = coverImage;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    next(error);
  }
};

export const addRemoveSong = async (req, res, next) => {
  try {
    const { songId, action } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to modify this playlist');
    }

    if (!songId || !action) {
      res.status(400);
      throw new Error('songId and action (add/remove) are required');
    }

    if (action === 'add') {
      await Playlist.findByIdAndUpdate(req.params.id, {
        $addToSet: { songs: songId },
      });
    } else if (action === 'remove') {
      await Playlist.findByIdAndUpdate(req.params.id, {
        $pull: { songs: songId },
      });
    } else {
      res.status(400);
      throw new Error('Action must be "add" or "remove"');
    }

    const updatedPlaylist = await Playlist.findById(req.params.id)
      .populate('songs', 'title artist coverImage duration');

    if (!updatedPlaylist.coverImage && updatedPlaylist.songs.length > 0) {
      updatedPlaylist.coverImage = updatedPlaylist.songs[0].coverImage;
      await updatedPlaylist.save();
    }

    res.json({ playlist: updatedPlaylist });
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this playlist');
    }

    await Playlist.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { playlists: req.params.id },
    });

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
};
