import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [view, setView] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = useRef([]);

  useEffect(() => {
    if (!otpSent || otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const handleSendOtp = () => {
    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }
    setOtpSent(true);
    setOtpTimer(60);
    setError('');
  };

  const handleResendOtp = () => {
    setOtpTimer(60);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    login('customer', email, password);
    navigate('/matching');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !signupEmail.trim() || !signupPassword.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const otpFilled = otp.every((d) => d !== '');
    if (!otpFilled) {
      setError('Please enter the OTP code');
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

    signup({
      fullName,
      email: signupEmail,
      phone,
      role: 'customer',
    });
    navigate('/matching');
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid #DDD',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

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
                  {showPassword ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
                </button>
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.primaryButton}>
              Login
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
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              style={inputStyle}
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Verification OTP</label>
            {!otpSent ? (
              <button type="button" onClick={handleSendOtp} style={styles.sendOtpButton}>
                Send OTP
              </button>
            ) : (
              <>
                <div style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      style={styles.otpBox}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength={1}
                      type="text"
                      inputMode="numeric"
                    />
                  ))}
                </div>
                {otpTimer > 0 ? (
                  <p style={styles.timerText}>Resend code in {otpTimer}s</p>
                ) : (
                  <button type="button" onClick={handleResendOtp} style={styles.resendButton}>
                    Resend Code
                  </button>
                )}
              </>
            )}
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

          <button type="submit" style={styles.primaryButton}>
            Sign Up
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F4F4F4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: '32px 20px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#003366',
    fontSize: 24,
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  subtitle: {
    color: '#888',
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
    color: '#003366',
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
    backgroundColor: '#FF6600',
    color: '#FFF',
    border: 'none',
    borderRadius: 8,
    padding: '14px 0',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 8,
  },
  sendOtpButton: {
    backgroundColor: '#003366',
    color: '#FFF',
    border: 'none',
    borderRadius: 8,
    padding: '10px 0',
    fontSize: 14,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  otpContainer: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
  },
  otpBox: {
    width: 'clamp(32px, 11vw, 42px)',
    height: 48,
    borderRadius: 8,
    border: '2px solid #003366',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    outline: 'none',
  },
  timerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    margin: '4px 0 0 0',
  },
  resendButton: {
    background: 'none',
    border: 'none',
    color: '#FF6600',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: 4,
  },
  error: {
    color: '#FF4444',
    fontSize: 13,
    margin: 0,
  },
  switchText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#FF6600',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 13,
  },
};
