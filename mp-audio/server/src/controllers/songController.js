import Song from '../models/Song.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const getAllSongs = async (req, res, next) => {
  try {
    const { search, genre, sort, limit = 20, page = 1 } = req.query;
    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { artist: searchRegex },
        { album: searchRegex },
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = new RegExp(genre, 'i');
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'plays') {
      sortOption = { plays: -1 };
    } else if (sort === 'likes') {
      sortOption = { likes: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [songs, total] = await Promise.all([
      Song.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Song.countDocuments(query),
    ]);

    res.json({
      songs,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id).lean();

    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }

    await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } });

    res.json({ song: { ...song, plays: song.plays + 1 } });
  } catch (error) {
    next(error);
  }
};

export const uploadSongController = async (req, res, next) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    if (!title || !artist || !duration) {
      res.status(400);
      throw new Error('Title, artist, and duration are required');
    }

    if (!req.cloudinaryAudio || !req.cloudinaryImage) {
      res.status(400);
      throw new Error('Audio file and cover image are required');
    }

    const song = await Song.create({
      title,
      artist,
      album: album || 'Single',
      genre: genre || 'Unknown',
      duration: parseFloat(duration),
      audioUrl: req.cloudinaryAudio.url,
      coverImage: req.cloudinaryImage.url,
      cloudinaryAudioId: req.cloudinaryAudio.publicId,
      cloudinaryImageId: req.cloudinaryImage.publicId,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ song });
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }

    if (song.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this song');
    }

    if (song.cloudinaryAudioId) {
      await cloudinary.uploader.destroy(song.cloudinaryAudioId, {
        resource_type: 'video',
      });
    }

    if (song.cloudinaryImageId) {
      await cloudinary.uploader.destroy(song.cloudinaryImageId, {
        resource_type: 'image',
      });
    }

    await Song.findByIdAndDelete(req.params.id);

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('likedSongs', 'genre');

    let songs;

    if (user.likedSongs && user.likedSongs.length > 0) {
      const likedGenres = [...new Set(user.likedSongs.map((s) => s.genre).filter(Boolean))];
      const likedSongIds = user.likedSongs.map((s) => s._id);

      songs = await Song.find({
        genre: { $in: likedGenres },
        _id: { $nin: likedSongIds },
      })
        .sort({ plays: -1 })
        .limit(20)
        .lean();

      if (songs.length < 10) {
        const additionalSongs = await Song.find({
          _id: { $nin: [...likedSongIds, ...songs.map((s) => s._id)] },
        })
          .sort({ plays: -1 })
          .limit(20 - songs.length)
          .lean();

        songs = [...songs, ...additionalSongs];
      }
    } else {
      songs = await Song.aggregate([{ $sample: { size: 20 } }]);
    }

    res.json({ songs });
  } catch (error) {
    next(error);
  }
};
