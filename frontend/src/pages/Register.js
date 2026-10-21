import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import AuthPanel from '../AuthPanel';

const ROLES = [
  { value: 'creator', label: 'Creator', mark: 'C', desc: 'I create content and want to showcase my work and find brand campaigns.' },
  { value: 'brand', label: 'Brand Representative', mark: 'B', desc: 'I represent a brand and want to launch campaigns and work with creators.' },
  { value: 'talent', label: 'Talent Manager', mark: 'T', desc: 'I represent creators and want to manage their campaigns and opportunities.' },
  { value: 'finance', label: 'Finance Manager', mark: 'F', desc: 'I handle invoices and payments for campaigns and creators.' },
];

function Register() {
  const [role, setRole] = useState(null); // null = still on the "choose a role" step
  const [form, setForm] = useState({ name: '', email: '', password: '', brandName: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { ...form, role });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const chosen = ROLES.find((r) => r.value === role);

  return (
    <div className="auth-page">
      <div className="auth-left">
        {!role ? (
          <>
            <p className="role-prompt">Choose to get your role started</p>
            <div className="role-list">
              {ROLES.map((r) => (
                <button type="button" key={r.value} className="role-card" onClick={() => setRole(r.value)}>
                  <span className="role-icon">{r.mark}</span>
                  <span>
                    <div className="role-name">Sign up as {r.label}</div>
                    <div className="role-desc">{r.desc}</div>
                  </span>
                </button>
              ))}
            </div>
            <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
          </>
        ) : (
          <div className="auth-card">
            <h1 className="auth-title">Sign up as<br /><span>{chosen.label}</span></h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />

              {role === 'brand' && (
                <>
                  <label htmlFor="brandName">Brand name</label>
                  <input id="brandName" name="brandName" value={form.brandName} onChange={handleChange} />
                </>
              )}

              <button type="submit" className="auth-continue-btn">Create account</button>
            </form>
            <p className="auth-switch">
              <button type="button" onClick={() => setRole(null)}>Change role</button>
              {' · '}
              <Link to="/login">Log in</Link>
            </p>
          </div>
        )}
      </div>

      <AuthPanel />
    </div>
  );
}

export default Register;
