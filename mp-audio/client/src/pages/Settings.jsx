import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Heart, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/userApi';
import { formatDate } from '../utils/formatTime';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data.user);
        setName(data.user.name);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const data = await updateProfile({ name: name.trim() });
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">
        Settings
      </h1>

      {/* Profile Section */}
      <motion.div
        className="glass rounded-2xl p-8 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-lg font-semibold text-text-primary mb-6">
          Profile
        </h2>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-brand/30 flex items-center justify-center flex-shrink-0 border-2 border-brand/20">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-brand-glow">
                {getInitials(user?.name)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{user?.name}</h3>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl px-4 py-3 text-text-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full bg-bg-elevated/50 border border-white/5 rounded-xl px-4 py-3 text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={loading || name === user?.name}
            className="bg-gradient-to-r from-brand to-brand-light px-6 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Account Info */}
      <motion.div
        className="glass rounded-2xl p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="font-display text-lg font-semibold text-text-primary mb-6">
          Account
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-bg-elevated/50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-glow" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Member Since</p>
              <p className="text-text-primary font-medium">
                {fetchingProfile ? '...' : formatDate(profileData?.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-bg-elevated/50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Liked Songs</p>
              <p className="text-text-primary font-medium">
                {fetchingProfile ? '...' : `${profileData?.likedSongs?.length || 0} songs`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-bg-elevated/50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Music className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Playlists</p>
              <p className="text-text-primary font-medium">
                {fetchingProfile ? '...' : `${profileData?.playlists?.length || 0} playlists`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
