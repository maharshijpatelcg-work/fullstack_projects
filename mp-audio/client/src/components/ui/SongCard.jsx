import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const SongCard = ({ song, queue = [] }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();

  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = (e) => {
    e.stopPropagation();
    playSong(song, queue.length > 0 ? queue : [song]);
  };

  return (
    <motion.div
      className="w-44 flex-shrink-0 cursor-pointer group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handlePlay}
    >
      <div className="relative mb-3">
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-brand fill-brand ml-0.5" />
          </div>
        </div>

        {isCurrentSong && isPlaying && (
          <div className="absolute bottom-2 right-2 flex items-end gap-0.5">
            <div className="w-1 bg-brand rounded-full animate-eq1" />
            <div className="w-1 bg-brand rounded-full animate-eq2" />
            <div className="w-1 bg-brand rounded-full animate-eq3" />
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-text-primary truncate">
        {song.title}
      </h3>
      <p className="text-xs text-text-muted truncate mt-0.5">
        {song.artist}
      </p>
    </motion.div>
  );
};

export default SongCard;
