import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Toast from './components/ui/Toast';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import Settings from './pages/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Toast />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
