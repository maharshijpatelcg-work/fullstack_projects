import { formatTime } from '../../utils/formatTime';
import { usePlayer } from '../../context/PlayerContext';

const ProgressBar = () => {
  const { currentTime, duration, seekTo } = usePlayer();

  const handleChange = (e) => {
    seekTo(parseFloat(e.target.value));
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full max-w-xl">
      <span className="text-xs text-text-muted font-mono w-10 text-right">
        {formatTime(currentTime)}
      </span>

      <div className="relative flex-1 group">
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
          max={duration || 0}
          value={currentTime}
          step="0.1"
          onChange={handleChange}
          className="relative w-full h-1 opacity-0 cursor-pointer z-10"
        />
      </div>

      <span className="text-xs text-text-muted font-mono w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
