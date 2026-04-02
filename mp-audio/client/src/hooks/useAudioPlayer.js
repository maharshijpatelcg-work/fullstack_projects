import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

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
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

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
  }, []);

  const play = useCallback(async (url) => {
    const audio = audioRef.current;
    if (url) {
      audio.src = url;
    }
    try {
      await audio.play();
    } catch (err) {
      console.error('Playback error:', err);
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
  }, []);

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.error('Playback error:', err);
      }
    } else {
      audio.pause();
    }
  }, []);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
  }, []);

  const setVolume = useCallback((v) => {
    audioRef.current.volume = v;
    setVolumeState(v);
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlayPause,
    seekTo,
    setVolume,
  };
};

export default useAudioPlayer;
