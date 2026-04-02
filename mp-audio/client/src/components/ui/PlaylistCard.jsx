import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const coverImage = playlist.coverImage ||
    (playlist.songs && playlist.songs.length > 0 ? playlist.songs[0].coverImage : null);

  const songCount = playlist.songs ? playlist.songs.length : 0;

  return (
    <motion.div
      className="cursor-pointer group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/playlist/${playlist._id}`)}
    >
      <div className="relative mb-3 aspect-square rounded-xl overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-muted to-brand/30 flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-brand-glow">
              {playlist.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center glow transform hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <h3 className="text-sm font-medium text-text-primary truncate">
        {playlist.name}
      </h3>
      <p className="text-xs text-text-muted mt-0.5">
        {songCount} {songCount === 1 ? 'song' : 'songs'}
      </p>
    </motion.div>
  );
};

export default PlaylistCard;
