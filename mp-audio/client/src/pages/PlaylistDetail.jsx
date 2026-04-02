import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Shuffle, Clock } from 'lucide-react';
import { getPlaylistById } from '../api/playlistApi';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import SongRow from '../components/ui/SongRow';
import { SkeletonRow } from '../components/ui/SkeletonCard';
import { getTotalDuration } from '../utils/formatTime';

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSong, toggleShuffle } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const data = await getPlaylistById(id);
        setPlaylist(data.playlist);
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlaylist();
  }, [id]);

  const handlePlayAll = () => {
    if (playlist?.songs?.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const handleShufflePlay = () => {
    if (playlist?.songs?.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.songs.length);
      playSong(playlist.songs[randomIndex], playlist.songs);
      toggleShuffle();
    }
  };

  const coverImage = playlist?.coverImage ||
    (playlist?.songs?.length > 0 ? playlist.songs[0].coverImage : null);

  const likedSongIds = user?.likedSongs?.map((s) => (typeof s === 'string' ? s : s._id)) || [];

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-64 bg-bg-surface animate-pulse rounded-2xl mb-8" />
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 md:p-8 text-center py-20">
        <p className="text-text-muted text-lg">Playlist not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-transparent" />

        <div className="absolute bottom-6 left-6 md:left-8 right-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-end gap-6"
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={playlist.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-2xl hidden sm:block"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-gradient-to-br from-brand-muted to-brand/30 flex items-center justify-center shadow-2xl hidden sm:block">
                <span className="text-5xl font-display font-bold text-brand-glow">
                  {playlist.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Playlist</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-2">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-sm text-text-secondary mb-2">{playlist.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{playlist.owner?.name || 'You'}</span>
                <span>•</span>
                <span>{playlist.songs?.length || 0} songs</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTotalDuration(playlist.songs)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 px-6 md:px-8 py-6">
        <button
          onClick={handlePlayAll}
          disabled={!playlist.songs?.length}
          className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full font-semibold text-white glow hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-white" />
          Play All
        </button>
        <button
          onClick={handleShufflePlay}
          disabled={!playlist.songs?.length}
          className="flex items-center gap-2 bg-bg-elevated hover:bg-bg-card px-6 py-3 rounded-full font-medium text-text-primary border border-white/10 transition-all disabled:opacity-50"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>
      </div>

      {/* Song List */}
      <div className="px-6 md:px-8 pb-8">
        {playlist.songs?.length > 0 ? (
          <div className="space-y-1">
            {playlist.songs.map((song, index) => (
              <SongRow
                key={song._id}
                song={song}
                index={index}
                queue={playlist.songs}
                isLiked={likedSongIds.includes(song._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg mb-2">This playlist is empty</p>
            <p className="text-text-muted/60 text-sm">Add songs to your playlist from the search page</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
