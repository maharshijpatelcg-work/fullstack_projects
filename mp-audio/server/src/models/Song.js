import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
  },
  album: {
    type: String,
    default: 'Single',
  },
  genre: {
    type: String,
    default: 'Unknown',
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required'],
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
  },
  cloudinaryAudioId: {
    type: String,
  },
  cloudinaryImageId: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  plays: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

songSchema.index({ title: 'text', artist: 'text', album: 'text' });
songSchema.index({ genre: 1 });
songSchema.index({ plays: -1 });
songSchema.index({ createdAt: -1 });

const Song = mongoose.model('Song', songSchema);

export default Song;
