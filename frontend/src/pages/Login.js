import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import AuthPanel from '../AuthPanel';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  // Google / Microsoft / passkey aren't connected to a provider in this build.
  // Instead of doing nothing, tell the user so the click is never "dead".
  const notWired = (name) => {
    setError('');
    setNotice(`${name} sign-in isn't set up yet. Use your email and password below.`);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <h1 className="auth-title">Creator Hub<br /><span>Portal</span></h1>
          <p className="auth-subtitle">
            Log in or sign up to manage collaborations and discover campaigns in the Creator Marketplace.
          </p>

          <button type="button" className="oauth-btn" onClick={() => notWired('Google')}>
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="oauth-btn" onClick={() => notWired('Microsoft')}>
            <MicrosoftIcon /> Continue with Microsoft
          </button>

          <div className="auth-divider"><span>Or</span></div>

          {notice && <div className="notice">{notice}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="email">Enter your email to continue</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

            <label className="auth-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />

            <button type="submit" className="auth-continue-btn">Continue with email</button>
          </form>

          <button type="button" className="auth-passkey" onClick={() => notWired('Passkey')}>
            <KeyIcon /> Sign in with passkey
          </button>

          <p className="auth-switch">
            No account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        <p className="auth-terms">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <AuthPanel />
    </div>
  );
}

function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.6 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 23 23">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export default Login;
