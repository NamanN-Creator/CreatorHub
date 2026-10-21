import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Pending', 'Processing', 'Paid', 'Failed'];

function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [creators, setCreators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ campaign: '', creator: '', amount: '', dueDate: '' });

  const load = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  useEffect(() => {
    load();
    if (user.role === 'finance') {
      api.get('/campaigns').then(({ data }) => setCampaigns(data)).catch((err) => setError(errMsg(err)));
      api.get('/auth/creators').then(({ data }) => setCreators(data)).catch((err) => setError(errMsg(err)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateInvoice = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/invoices', form);
      setForm({ campaign: '', creator: '', amount: '', dueDate: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.put(`/invoices/${id}`, { status });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">{user.role === 'finance' ? 'Invoice Management' : 'My Invoices'}</h1>
      <p className="page-sub">
        {user.role === 'finance'
          ? 'Generate invoices and track payment status.'
          : 'Payments owed to you across every campaign.'}
      </p>

      {error && <div className="error">{error}</div>}

      {user.role === 'finance' && (
        <div className="card">
          <div className="row">
            <strong>Generate Invoice</strong>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Generate Invoice'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={generateInvoice} style={{ marginTop: 16 }}>
              <label>Campaign</label>
              <select name="campaign" value={form.campaign} onChange={handleChange} required>
                <option value="">Select a campaign</option>
                {campaigns.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <label>Creator</label>
              <select name="creator" value={form.creator} onChange={handleChange} required>
                <option value="">Select a creator</option>
                {creators.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
              </select>

              <label>Amount (₹)</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} required />

              <label>Due Date</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Generate Invoice</button>
            </form>
          )}
        </div>
      )}

      {invoices.length === 0 && <div className="empty">No invoices yet.</div>}

      {invoices.map((inv) => (
        <div className="card" key={inv._id}>
          <div className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{inv.campaign?.name}</div>
              <div className="muted">
                {user.role === 'finance' && inv.creator?.name ? `${inv.creator.name} · ` : ''}
                Due {inv.dueDate?.slice(0, 10) || '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>₹{inv.amount}</div>
              {user.role === 'finance' ? (
                <select
                  value={inv.status}
                  onChange={(e) => updateStatus(inv._id, e.target.value)}
                  style={{ marginBottom: 0, width: 'auto' }}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <span className={`badge ${inv.status}`}>{inv.status}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Invoices;
