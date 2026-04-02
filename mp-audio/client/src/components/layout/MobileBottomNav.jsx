import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Music, User } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const tabs = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/settings', icon: User, label: 'Profile' },
];

const MobileBottomNav = () => {
  const { currentSong } = usePlayer();

  return (
    <nav className={`fixed left-0 right-0 z-30 glass border-t border-white/5 md:hidden ${currentSong ? 'bottom-[90px]' : 'bottom-0'}`}>
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-brand-glow' : 'text-text-muted'
              }`
            }
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
