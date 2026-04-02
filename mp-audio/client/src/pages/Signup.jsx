import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/home');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-bg-surface to-black items-center justify-center">
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-brand/30 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-brand-light/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

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
            Join millions of music lovers. Start your premium listening experience today.
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-bg-primary px-6">
        <motion.div
          className="glass rounded-2xl p-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="lg:hidden text-center mb-6">
            <h1 className="font-display text-3xl font-bold gradient-text">MP AUDIO</h1>
          </div>

          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
            Create Account
          </h2>
          <p className="text-text-muted text-sm mb-8">
            Start your musical journey with MP AUDIO
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-all"
                required
              />
            </div>

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
                placeholder="Password (min 6 characters)"
                className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-xl pl-12 pr-12 py-3 text-text-primary placeholder:text-text-muted outline-none transition-all"
                required
                minLength={6}
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-glow hover:text-brand-light transition-colors font-medium">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
