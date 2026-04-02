import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toggleLike } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const LikeButton = ({ songId, initialLiked = false, size = 18 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!user) return;

    setIsAnimating(true);
    setLiked(!liked);

    try {
      const data = await toggleLike(songId);
      setLiked(data.liked);
    } catch (error) {
      setLiked(liked);
      console.error('Failed to toggle like:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <motion.button
      className="focus:outline-none"
      onClick={handleToggle}
      whileTap={{ scale: 1.3 }}
      animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Heart
        size={size}
        className={`transition-colors duration-200 ${
          liked
            ? 'text-red-500 fill-red-500'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      />
    </motion.button>
  );
};

export default LikeButton;
