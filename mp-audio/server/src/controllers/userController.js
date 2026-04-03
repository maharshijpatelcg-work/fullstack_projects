import User from '../models/User.js';
import Song from '../models/Song.js';
import cloudinary from '../config/cloudinary.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('likedSongs')
      .populate({
        path: 'playlists',
        populate: {
          path: 'songs',
          select: 'title artist coverImage duration',
        },
      });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.file) {
      if (user.avatar) {
        const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.log('Could not delete old avatar:', e.message);
        }
      }
      user.avatar = req.file.path;
    }

    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const song = await Song.findById(songId);
    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }

    const isLiked = user.likedSongs.includes(songId);

    if (isLiked) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedSongs: songId },
      });
      await Song.findByIdAndUpdate(songId, {
        $inc: { likes: -1 },
      });

      res.json({ liked: false, message: 'Song removed from liked songs' });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { likedSongs: songId },
      });
      await Song.findByIdAndUpdate(songId, {
        $inc: { likes: 1 },
      });

      res.json({ liked: true, message: 'Song added to liked songs' });
    }
  } catch (error) {
    next(error);
  }
};

export const addToRecent = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.recentlyPlayed = user.recentlyPlayed.filter(
      (entry) => entry.song.toString() !== songId
    );

    user.recentlyPlayed.unshift({
      song: songId,
      playedAt: new Date(),
    });

    if (user.recentlyPlayed.length > 50) {
      user.recentlyPlayed = user.recentlyPlayed.slice(0, 50);
    }

    await user.save();

    res.json({ message: 'Added to recently played' });
  } catch (error) {
    next(error);
  }
};

export const getRecentlyPlayed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyPlayed.song',
      model: 'Song',
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const recentSongs = user.recentlyPlayed
      .filter((entry) => entry.song !== null)
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
      .slice(0, 20)
      .map((entry) => ({
        ...entry.song.toObject(),
        playedAt: entry.playedAt,
      }));

    res.json({ songs: recentSongs });
  } catch (error) {
    next(error);
  }
};
