import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { getAllSongs, getRecommendations } from '../api/songApi';
import { getRecentlyPlayed } from '../api/userApi';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/ui/SongCard';
import SkeletonCard from '../components/ui/SkeletonCard';

const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [featuredSong, setFeaturedSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recentData, trendingData, recsData] = await Promise.allSettled([
          getRecentlyPlayed(),
          getAllSongs({ sort: 'plays', limit: 12 }),
          getRecommendations(),
        ]);

        const recent = recentData.status === 'fulfilled' ? recentData.value.songs || [] : [];
        const trending = trendingData.status === 'fulfilled' ? trendingData.value.songs || [] : [];
        const recs = recsData.status === 'fulfilled' ? recsData.value.songs || [] : [];

        setRecentSongs(recent);
        setTrendingSongs(trending);
        setRecommended(recs);

        const featured = trending[0] || recent[0] || recs[0] || null;
        setFeaturedSong(featured);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayFeatured = () => {
    if (featuredSong) {
      playSong(featuredSong, trendingSongs.length > 0 ? trendingSongs : [featuredSong]);
    }
  };

  const SongCarousel = ({ title, songs, queue }) => (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-6 md:px-8">
        <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
        <button className="flex items-center gap-1 text-sm text-text-muted hover:text-brand-glow transition-colors">
          See All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 md:px-8 pb-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : songs.length > 0 ? (
          <motion.div
            className="flex gap-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {songs.map((song) => (
              <motion.div key={song._id} variants={itemVariants}>
                <SongCard song={song} queue={queue || songs} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-text-muted text-sm">No songs available yet</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {featuredSong ? (
        <div className="relative h-72 md:h-80 mb-8 overflow-hidden">
          <img
            src={featuredSong.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

          <div className="absolute bottom-8 left-6 md:left-8 right-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {featuredSong.genre && (
                <span className="inline-block px-3 py-1 bg-brand/20 text-brand-glow text-xs font-medium rounded-full mb-3 border border-brand/30">
                  {featuredSong.genre}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-2 line-clamp-2">
                {featuredSong.title}
              </h1>
              <p className="text-text-secondary text-sm md:text-base mb-4">
                {featuredSong.artist}
              </p>
              <button
                onClick={handlePlayFeatured}
                className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full font-semibold text-white glow hover:opacity-90 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                Play Now
              </button>
            </motion.div>
          </div>
        </div>
      ) : loading ? (
        <div className="h-72 md:h-80 mb-8 bg-bg-surface animate-pulse" />
      ) : (
        <div className="h-40 flex items-center justify-center mb-8">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold gradient-text mb-2">Welcome to MP AUDIO</h1>
            <p className="text-text-muted">Upload some songs to get started!</p>
          </div>
        </div>
      )}

      {/* Carousels */}
      <SongCarousel title="Recently Played" songs={recentSongs} />
      <SongCarousel title="Trending Now" songs={trendingSongs} />
      <SongCarousel title="Made For You" songs={recommended} />
    </div>
  );
};

export default Home;
