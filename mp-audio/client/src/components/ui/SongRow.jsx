import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import LikeButton from './LikeButton';

const SongRow = ({ song, index, queue = [], isLiked = false }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();

  const isCurrentSong = currentSong?._id === song._id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const handlePlay = () => {
    playSong(song, queue.length > 0 ? queue : [song]);
  };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-2.5 rounded-lg group cursor-pointer transition-colors duration-200 ${
        isCurrentSong ? 'bg-brand/10' : 'hover:bg-bg-elevated'
      }`}
      onClick={handlePlay}
    >
      <div className="w-8 flex items-center justify-center">
        {isCurrentlyPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            <div className="w-1 bg-brand rounded-full animate-eq1" />
            <div className="w-1 bg-brand rounded-full animate-eq2" />
            <div className="w-1 bg-brand rounded-full animate-eq3" />
          </div>
        ) : (
          <>
            <span className="text-sm text-text-muted group-hover:hidden font-mono">
              {index !== undefined ? index + 1 : ''}
            </span>
            <Play className="w-4 h-4 text-text-primary hidden group-hover:block fill-text-primary" />
          </>
        )}
      </div>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className={`text-sm truncate ${isCurrentSong ? 'text-brand-glow font-medium' : 'text-text-primary'}`}>
            {song.title}
          </p>
          <p className="text-xs text-text-muted truncate">{song.artist}</p>
        </div>
      </div>

      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-xs text-text-muted truncate">{song.album || 'Single'}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <LikeButton songId={song._id} initialLiked={isLiked} />
        </div>
        <span className="text-xs text-text-muted font-mono w-10 text-right">
          {formatTime(song.duration)}
        </span>
      </div>
    </div>
  );
};

export default SongRow;
