import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/auth/AuthShell';

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
    <AuthShell
      eyebrow="Premium access"
      title="Welcome back"
      description="Sign in to pick up your playlists, search faster, and keep the music flowing."
      heroTitle={
        <>
          Sound that feels <span className="gradient-text">alive</span>.
        </>
      }
      heroDescription="A sharper auth experience gives MP AUDIO a cleaner first impression on every screen, from compact phones to wide desktops."
      footer={(
        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      )}
    >
      <form onSubmit={handleSubmit} className="auth-form">
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-input auth-input--with-action"
            required
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
