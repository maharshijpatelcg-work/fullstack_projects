import { motion } from 'framer-motion';

const ArtistCard = ({ artist, songCount, image, onClick }) => {
  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative mb-3">
        {image ? (
          <img
            src={image}
            alt={artist}
            className="w-32 h-32 rounded-full object-cover border-2 border-transparent group-hover:border-brand transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand/20"
            loading="lazy"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-muted to-brand/40 flex items-center justify-center border-2 border-transparent group-hover:border-brand transition-all duration-300">
            <span className="text-3xl font-display font-bold text-brand-glow">
              {artist.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-text-primary text-center truncate max-w-[130px]">
        {artist}
      </h3>
      {songCount !== undefined && (
        <p className="text-xs text-text-muted mt-0.5">
          {songCount} {songCount === 1 ? 'song' : 'songs'}
        </p>
      )}
    </motion.div>
  );
};

export default ArtistCard;
