import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';
import { createPlaylist } from '../../api/playlistApi';
import toast from 'react-hot-toast';

const CreatePlaylistModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    setLoading(true);
    try {
      const data = await createPlaylist({ name: name.trim(), description: description.trim() });
      toast.success('Playlist created!');
      setName('');
      setDescription('');
      if (onCreated) onCreated(data.playlist);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative glass rounded-2xl p-8 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-brand-glow" />
              </div>
              <h2 className="text-xl font-display font-bold text-text-primary">
                New Playlist
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full bg-gradient-to-r from-brand to-brand-light rounded-xl py-3 font-semibold text-white hover:opacity-90 glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Playlist'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylistModal;
