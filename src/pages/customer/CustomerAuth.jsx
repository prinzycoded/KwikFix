import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, firebaseReady } = useAuth();

  const bookingQuery = searchParams.toString();

  const [view, setView] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!firebaseReady) {
      setError('Firebase is not configured. Add your config to .env (see .env.example)');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(`/matching${bookingQuery ? `?${bookingQuery}` : ''}`);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!firebaseReady) {
      setError('Firebase is not configured. Add your config to .env (see .env.example)');
      return;
    }

    if (!fullName.trim() || !signupEmail.trim() || !signupPassword.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        fullName,
        email: signupEmail,
        password: signupPassword,
        phone,
        role: 'customer',
      });
      navigate(`/matching${bookingQuery ? `?${bookingQuery}` : ''}`);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    backgroundColor: '#0A2540',
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const eyeIconProps = { size: 20, color: '#9DB0C5' };

  if (view === 'login') {
    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Log in to continue</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={inputStyle}
                placeholder="e.g. john@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  style={{ ...inputStyle, paddingRight: 44 }}
                  placeholder="e.g. ••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
{showPassword ? <EyeOff {...eyeIconProps} /> : <Eye {...eyeIconProps} />}
                </button>
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.primaryButton} disabled={submitting}>
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <button onClick={() => { setView('signup'); setError(''); }} style={styles.linkButton}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Sign up to get started</p>

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={inputStyle}
              placeholder="e.g. Chinedu Okafor"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone (optional)</label>
            <input
              style={inputStyle}
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={inputStyle}
              placeholder="e.g. john@email.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              type="email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                style={{ ...inputStyle, paddingRight: 44 }}
                placeholder="Enter password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={inputStyle}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.primaryButton} disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <button onClick={() => { setView('login'); setError(''); }} style={styles.linkButton}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

const getFriendlyError = (err) => {
  const code = err?.code || '';
  const messages = {
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password. Please try again',
    'auth/invalid-credential': 'Incorrect email or password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase',
    'auth/requires-recent-login': 'Please log in again to complete this action',
    'auth/network-request-failed': 'Network error. Check your connection and try again',
  };
  return messages[code] || (err?.message || 'Something went wrong. Please try again');
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0A2540',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#0D3054',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '32px 20px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  subtitle: {
    color: '#9DB0C5',
    fontSize: 14,
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 600,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    color: '#0A2540',
    border: 'none',
    borderRadius: 16,
    padding: '15px 0',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 8,
  },
  error: {
    color: '#F87171',
    fontSize: 13,
    margin: 0,
  },
  switchText: {
    color: '#9DB0C5',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#FF6B1A',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 13,
  },
};
