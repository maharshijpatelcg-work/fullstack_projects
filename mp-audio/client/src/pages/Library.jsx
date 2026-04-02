import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { getMyPlaylists } from '../api/playlistApi';
import { getProfile } from '../api/userApi';
import PlaylistCard from '../components/ui/PlaylistCard';
import SongRow from '../components/ui/SongRow';
import { SkeletonRow } from '../components/ui/SkeletonCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import CreatePlaylistModal from '../components/ui/CreatePlaylistModal';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'liked' ? 'liked' : 'playlists';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [playlistData, profileData] = await Promise.allSettled([
        getMyPlaylists(),
        getProfile(),
      ]);

      if (playlistData.status === 'fulfilled') {
        setPlaylists(playlistData.value.playlists || []);
      }

      if (profileData.status === 'fulfilled') {
        setLikedSongs(profileData.value.user?.likedSongs || []);
      }
    } catch (error) {
      console.error('Failed to fetch library data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'liked' ? { tab: 'liked' } : {});
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
  };

  const likedSongIds = likedSongs.map((s) => (typeof s === 'string' ? s : s._id));

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-6">
        Your Library
      </h1>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-white/5">
        <button
          onClick={() => handleTabChange('playlists')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'playlists'
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          My Playlists
          {activeTab === 'playlists' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
              layoutId="tab-indicator"
            />
          )}
        </button>
        <button
          onClick={() => handleTabChange('liked')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'liked'
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Liked Songs
          {activeTab === 'liked' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
              layoutId="tab-indicator"
            />
          )}
        </button>
      </div>

      {/* Playlists Tab */}
      {activeTab === 'playlists' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {/* New Playlist Card */}
              <motion.button
                className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-brand/50 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:bg-bg-elevated/30"
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-brand-glow" />
                </div>
                <span className="text-sm text-text-muted">New Playlist</span>
              </motion.button>

              {playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Liked Songs Tab */}
      {activeTab === 'liked' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : likedSongs.length > 0 ? (
            <div className="space-y-1">
              {likedSongs.map((song, index) => (
                <SongRow
                  key={song._id}
                  song={song}
                  index={index}
                  queue={likedSongs}
                  isLiked={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg mb-2">No liked songs yet</p>
              <p className="text-text-muted/60 text-sm">Songs you like will appear here</p>
            </div>
          )}
        </motion.div>
      )}

      <CreatePlaylistModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handlePlaylistCreated}
      />
    </div>
  );
};

export default Library;
