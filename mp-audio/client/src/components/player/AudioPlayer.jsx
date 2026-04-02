import { usePlayer } from '../../context/PlayerContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import LikeButton from '../ui/LikeButton';
import { Music } from 'lucide-react';

const AudioPlayer = () => {
  const { currentSong, isPlaying } = usePlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] glass border-t border-white/5 z-40 px-4">
      <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto">
        {/* Left: Song Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          {currentSong ? (
            <>
              <div className="relative flex-shrink-0">
                <img
                  src={currentSong.coverImage}
                  alt={currentSong.title}
                  className={`w-12 h-12 rounded-lg object-cover ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                  style={!isPlaying ? { animationPlayState: 'paused' } : {}}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text-primary font-medium truncate max-w-[120px]">
                  {currentSong.title}
                </p>
                <p className="text-xs text-text-muted truncate max-w-[120px]">
                  {currentSong.artist}
                </p>
              </div>
              <div className="flex-shrink-0">
                <LikeButton songId={currentSong._id} size={16} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center">
                <Music className="w-5 h-5 text-text-muted" />
              </div>
              <div>
                <p className="text-sm text-text-muted">No song playing</p>
                <p className="text-xs text-text-muted">Select a song to play</p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Controls + Progress */}
        <div className="flex flex-col items-center gap-1 w-2/4">
          <PlayerControls />
          <ProgressBar />
        </div>

        {/* Right: Volume */}
        <div className="flex items-center justify-end w-1/4">
          <VolumeControl />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
