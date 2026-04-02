import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const PlayerControls = () => {
  const {
    isPlaying,
    pauseResume,
    nextSong,
    prevSong,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
    currentSong,
  } = usePlayer();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleShuffle}
        className={`transition-colors ${
          isShuffle ? 'text-brand' : 'text-text-muted hover:text-text-primary'
        }`}
        title="Shuffle"
      >
        <Shuffle className="w-4 h-4" />
      </button>

      <button
        onClick={prevSong}
        className="text-text-muted hover:text-text-primary transition-colors"
        title="Previous"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      <button
        onClick={pauseResume}
        disabled={!currentSong}
        className="w-10 h-10 bg-brand hover:bg-brand-light rounded-full flex items-center justify-center glow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white fill-white" />
        ) : (
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        )}
      </button>

      <button
        onClick={nextSong}
        className="text-text-muted hover:text-text-primary transition-colors"
        title="Next"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      <button
        onClick={toggleRepeat}
        className={`transition-colors ${
          isRepeat ? 'text-brand' : 'text-text-muted hover:text-text-primary'
        }`}
        title="Repeat"
      >
        <Repeat className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PlayerControls;
