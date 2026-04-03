import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mp-audio/songs',
    resource_type: 'video',
    allowed_formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mp-audio/covers',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadSong = multer({
  storage: multer.memoryStorage(),
}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

export const uploadSongToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audio || !req.files.cover) {
      return res.status(400).json({ message: 'Audio file and cover image are required' });
    }

    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover[0];

    const audioResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'mp-audio/songs',
          resource_type: 'video',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(audioFile.buffer);
    });

    const imageResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'mp-audio/covers',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(coverFile.buffer);
    });

    req.cloudinaryAudio = {
      url: audioResult.secure_url,
      publicId: audioResult.public_id,
    };

    req.cloudinaryImage = {
      url: imageResult.secure_url,
      publicId: imageResult.public_id,
    };

    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    next(error);
  }
};

export const uploadAvatar = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('avatar');

export { audioUpload, imageUpload };
