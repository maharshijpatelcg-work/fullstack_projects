import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { addToRecent } from '../api/userApi';

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('mp-audio-volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNextSong();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isRepeat, queue, queueIndex, isShuffle]);

  const handleNextSong = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
      while (nextIndex === queueIndex && queue.length > 1) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (isRepeat) {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      setCurrentSong(nextSong);
      setQueueIndex(nextIndex);
      audioRef.current.src = nextSong.audioUrl;
      audioRef.current.play().catch(console.error);

      addToRecent(nextSong._id).catch(() => {});
    }
  }, [queue, queueIndex, isShuffle, isRepeat]);

  const playSong = useCallback((song, songQueue = []) => {
    if (!song) return;

    const newQueue = songQueue.length > 0 ? songQueue : [song];
    const index = newQueue.findIndex((s) => s._id === song._id);

    setCurrentSong(song);
    setQueue(newQueue);
    setQueueIndex(index >= 0 ? index : 0);
    setCurrentTime(0);
    setDuration(0);

    audioRef.current.src = song.audioUrl;
    audioRef.current.play().catch(console.error);

    addToRecent(song._id).catch(() => {});
  }, []);

  const pauseResume = useCallback(async () => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.error('Playback error:', err);
      }
    } else {
      audio.pause();
    }
  }, [currentSong]);

  const nextSong = useCallback(() => {
    handleNextSong();
  }, [handleNextSong]);

  const prevSong = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (queue.length === 0) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = isRepeat ? queue.length - 1 : 0;
    }

    const prevSongItem = queue[prevIndex];
    if (prevSongItem) {
      setCurrentSong(prevSongItem);
      setQueueIndex(prevIndex);
      audioRef.current.src = prevSongItem.audioUrl;
      audioRef.current.play().catch(console.error);

      addToRecent(prevSongItem._id).catch(() => {});
    }
  }, [queue, queueIndex, isRepeat]);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v) => {
    const vol = Math.max(0, Math.min(1, v));
    audioRef.current.volume = vol;
    setVolumeState(vol);
    localStorage.setItem('mp-audio-volume', vol.toString());
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const value = {
    currentSong,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    isRepeat,
    playSong,
    pauseResume,
    nextSong,
    prevSong,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
