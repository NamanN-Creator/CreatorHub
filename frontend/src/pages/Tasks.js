import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Not Started', 'In Progress', 'Under Review', 'Completed'];

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [creators, setCreators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    campaign: '', creator: '', title: '', description: '', deadline: '', priority: 'Medium',
  });

  const load = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  useEffect(() => {
    load();
    if (user.role === 'talent') {
      api.get('/campaigns').then(({ data }) => setCampaigns(data)).catch((err) => setError(errMsg(err)));
      api.get('/auth/creators').then(({ data }) => setCreators(data)).catch((err) => setError(errMsg(err)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const assignTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', form);
      setForm({ campaign: '', creator: '', title: '', description: '', deadline: '', priority: 'Medium' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.put(`/tasks/${id}`, { status });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">{user.role === 'talent' ? 'Task Tracking' : 'My Tasks'}</h1>
      <p className="page-sub">
        {user.role === 'talent'
          ? 'Assign deliverables to creators and track progress.'
          : 'Your assigned deliverables across every campaign.'}
      </p>

      {error && <div className="error">{error}</div>}

      {user.role === 'talent' && (
        <div className="card">
          <div className="row">
            <strong>Assign Task</strong>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Assign Task'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={assignTask} style={{ marginTop: 16 }}>
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

              <label>Task Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Submit Instagram Reel draft" required />

              <label>Description</label>
              <textarea name="description" rows="2" value={form.description} onChange={handleChange} />

              <div className="row">
                <div style={{ flex: 1 }}>
                  <label>Deadline</label>
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Assign Task</button>
            </form>
          )}
        </div>
      )}

      {tasks.length === 0 && <div className="empty">No tasks yet.</div>}

      {tasks.map((t) => (
        <div className="card" key={t._id}>
          <div className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{t.title}</div>
              <div className="muted">
                {t.campaign?.name}
                {user.role === 'talent' && t.creator?.name ? ` · ${t.creator.name}` : ''}
                {t.deadline ? ` · Due ${t.deadline.slice(0, 10)}` : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <select
                value={t.status}
                onChange={(e) => updateStatus(t._id, e.target.value)}
                style={{ marginBottom: 0, width: 'auto' }}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
