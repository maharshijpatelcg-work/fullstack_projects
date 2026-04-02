import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';

const navLinks = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isPlaying } = usePlayer();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 w-60 h-[calc(100vh-90px)] bg-bg-surface border-r border-white/5 flex flex-col z-30 hidden md:flex">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold gradient-text">MP</span>
          <div className="flex flex-col">
            <span className="text-xs text-text-muted tracking-[0.3em] font-body uppercase">
              AUDIO
            </span>
            {/* Equalizer bars */}
            <div className="flex items-end gap-[2px] h-3 mt-0.5">
              <div
                className={`w-[3px] bg-brand rounded-full ${isPlaying ? 'animate-eq1' : ''}`}
                style={{ height: isPlaying ? undefined : '4px' }}
              />
              <div
                className={`w-[3px] bg-brand-light rounded-full ${isPlaying ? 'animate-eq2' : ''}`}
                style={{ height: isPlaying ? undefined : '6px' }}
              />
              <div
                className={`w-[3px] bg-brand-glow rounded-full ${isPlaying ? 'animate-eq3' : ''}`}
                style={{ height: isPlaying ? undefined : '4px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200 ${
                isActive
                  ? 'bg-brand/10 border-l-2 border-brand text-brand-glow'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 border-l-2 border-transparent'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/library?tab=liked"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200 ${
              isActive
                ? 'bg-brand/10 border-l-2 border-brand text-brand-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 border-l-2 border-transparent'
            }`
          }
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm font-medium">Liked Songs</span>
        </NavLink>
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand/30 flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-brand-glow">
                {getInitials(user?.name)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary font-medium truncate">
              {user?.name || 'User'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
