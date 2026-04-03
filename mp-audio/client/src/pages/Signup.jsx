import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/auth/AuthShell';

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
    <AuthShell
      eyebrow="Create your space"
      title="Create account"
      description="Join MP AUDIO and start building a cleaner, more personal listening experience."
      heroTitle={
        <>
          Build your <span className="gradient-text">next favorite</span> listening space.
        </>
      }
      heroDescription="The signup view now follows the same polished system as login, with better sizing, alignment, and mobile behavior."
      footer={(
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      )}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span className="sr-only">Full name</span>
          <User className="auth-field__icon" />
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="auth-input"
            required
          />
        </label>

        <label className="auth-field">
          <span className="sr-only">Email address</span>
          <Mail className="auth-field__icon" />
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="auth-input"
            required
          />
        </label>

        <label className="auth-field">
          <span className="sr-only">Password</span>
          <Lock className="auth-field__icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="auth-input auth-input--with-action"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="auth-field__action"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </label>

        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? (
            <>
              <span className="auth-spinner" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default Signup;
