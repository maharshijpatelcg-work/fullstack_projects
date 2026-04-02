import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import AudioPlayer from '../player/AudioPlayer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-60 pb-[90px] min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Nav */}
      <MobileBottomNav />

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  );
};

export default MainLayout;
