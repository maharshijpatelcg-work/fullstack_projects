import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/ui/SearchBar';
import SongRow from '../components/ui/SongRow';
import { SkeletonRow } from '../components/ui/SkeletonCard';
import { useDebounce } from '../hooks/useDebounce';
import { getAllSongs } from '../api/songApi';
import { useAuth } from '../context/AuthContext';

const genres = [
  { name: 'Pop', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Rock', gradient: 'from-red-600 to-orange-500' },
  { name: 'Hip-Hop', gradient: 'from-yellow-500 to-amber-600' },
  { name: 'Electronic', gradient: 'from-cyan-500 to-blue-500' },
  { name: 'Jazz', gradient: 'from-amber-600 to-yellow-700' },
  { name: 'Classical', gradient: 'from-emerald-600 to-teal-500' },
  { name: 'R&B', gradient: 'from-purple-500 to-pink-500' },
  { name: 'Latin', gradient: 'from-orange-500 to-red-500' },
  { name: 'Indie', gradient: 'from-teal-400 to-emerald-500' },
  { name: 'Metal', gradient: 'from-gray-700 to-gray-900' },
  { name: 'Country', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Lofi', gradient: 'from-indigo-500 to-purple-600' },
];

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genreLoading, setGenreLoading] = useState(false);
  const [genreResults, setGenreResults] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const debouncedQuery = useDebounce(query, 400);
  const { user } = useAuth();

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const searchSongs = async () => {
      setLoading(true);
      setActiveGenre(null);
      try {
        const data = await getAllSongs({ search: debouncedQuery });
        setResults(data.songs || []);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchSongs();
  }, [debouncedQuery]);

  const handleGenreClick = async (genreName) => {
    setActiveGenre(genreName);
    setQuery('');
    setGenreLoading(true);
    try {
      const data = await getAllSongs({ genre: genreName, limit: 50 });
      setGenreResults(data.songs || []);
    } catch (error) {
      console.error('Genre search failed:', error);
      setGenreResults([]);
    } finally {
      setGenreLoading(false);
    }
  };

  const clearGenre = () => {
    setActiveGenre(null);
    setGenreResults([]);
  };

  const likedSongIds = user?.likedSongs?.map((s) => (typeof s === 'string' ? s : s._id)) || [];

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SearchBar
          onSearch={(val) => {
            setQuery(val);
            if (val) setActiveGenre(null);
          }}
          placeholder="What do you want to listen to?"
          autoFocus
        />
      </motion.div>

      {/* Active Genre Header */}
      {activeGenre && (
        <div className="flex items-center gap-3 mt-6 mb-4">
          <h2 className="font-display text-2xl font-bold text-text-primary">{activeGenre}</h2>
          <button
            onClick={clearGenre}
            className="text-xs text-text-muted hover:text-brand-glow border border-white/10 rounded-full px-3 py-1 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Search Results */}
      {debouncedQuery && !activeGenre && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
            {loading ? 'Searching...' : `Results for "${debouncedQuery}"`}
          </h2>

          {loading ? (
            <div className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((song, index) => (
                <SongRow
                  key={song._id}
                  song={song}
                  index={index}
                  queue={results}
                  isLiked={likedSongIds.includes(song._id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm mt-4">
              No songs found for "{debouncedQuery}"
            </p>
          )}
        </div>
      )}

      {/* Genre Results */}
      {activeGenre && (
        <div className="mt-2">
          {genreLoading ? (
            <div className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : genreResults.length > 0 ? (
            <div className="space-y-1">
              {genreResults.map((song, index) => (
                <SongRow
                  key={song._id}
                  song={song}
                  index={index}
                  queue={genreResults}
                  isLiked={likedSongIds.includes(song._id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm mt-4">
              No songs found in {activeGenre}
            </p>
          )}
        </div>
      )}

      {/* Genre Grid (default state) */}
      {!debouncedQuery && !activeGenre && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-text-primary mb-6">
            Browse Genres
          </h2>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {genres.map((genre) => (
              <motion.button
                key={genre.name}
                className={`relative rounded-2xl p-6 text-left overflow-hidden bg-gradient-to-br ${genre.gradient} hover:scale-105 transition-transform duration-200 aspect-[4/3]`}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                }}
                onClick={() => handleGenreClick(genre.name)}
              >
                <span className="font-display text-xl font-bold text-white drop-shadow-lg">
                  {genre.name}
                </span>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Search;
