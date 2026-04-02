import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, signup as signupApi, getMe } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const hydrateUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data.user);
      setToken(storedToken);
    } catch (error) {
      console.error('Failed to hydrate user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await signupApi(name, email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome to MP AUDIO, ${data.user.name}!`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
