import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const VolumeControl = () => {
  const { volume, setVolume } = usePlayer();

  const handleChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.8);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const progress = volume * 100;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-text-muted hover:text-text-primary transition-colors"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>

      <div className="relative w-24 group">
        <div className="absolute inset-y-0 flex items-center w-full">
          <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleChange}
          className="relative w-full h-1 opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
};

export default VolumeControl;
