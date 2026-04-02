import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-bg-surface to-black items-center justify-center">
        {/* Animated background circles */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand/30 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-light/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 text-center px-12">
          <motion.h1
            className="font-display text-6xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            MP AUDIO
          </motion.h1>
          <motion.p
            className="text-text-muted text-lg max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your premium music streaming experience. Discover, play, and feel the rhythm.
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-bg-primary px-6">
        <motion.div
          className="glass rounded-2xl p-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="font-display text-3xl font-bold gradient-text">MP AUDIO</h1>
          </div>

          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
            Welcome Back
          </h2>
          <p className="text-text-muted text-sm mb-8">
            Sign in to continue your musical journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl pl-12 pr-12 py-3 text-text-primary placeholder:text-text-muted outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand to-brand-light rounded-xl py-3 font-semibold text-white hover:opacity-90 glow transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-glow hover:text-brand-light transition-colors font-medium">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
