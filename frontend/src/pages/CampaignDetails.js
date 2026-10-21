import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

function CampaignDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [proposal, setProposal] = useState({ rate: '', deliverables: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/campaigns/${id}`)
      .then(({ data }) => setCampaign(data))
      .catch((err) => setError(errMsg(err)));
  }, [id]);

  const handleChange = (e) => setProposal({ ...proposal, [e.target.name]: e.target.value });

  const sendProposal = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/proposals', { campaign: id, ...proposal });
      setSent(true);
      setTimeout(() => navigate('/proposals'), 800);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (!campaign) return <div className="page">{error ? <div className="error">{error}</div> : 'Loading...'}</div>;

  return (
    <div className="page">
      <h1 className="page-title">{campaign.name}</h1>
      <p className="page-sub">{campaign.brand}</p>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <p>{campaign.description}</p>
        <p><strong>Target Audience:</strong> {campaign.targetAudience}</p>
        <p><strong>Niche:</strong> {campaign.niche} &nbsp; <strong>Platform:</strong> {campaign.platform}</p>
        <p><strong>Deliverables:</strong> {campaign.deliverables}</p>
        <p><strong>Budget:</strong> {campaign.budget}</p>
        <p><strong>Timeline:</strong> {campaign.startDate?.slice(0, 10)} – {campaign.endDate?.slice(0, 10)}</p>
      </div>

      {user.role === 'creator' && (
        <div className="card">
          <strong>Send Your Proposal</strong>
          {sent ? (
            <p className="muted" style={{ marginTop: 10 }}>Proposal sent!</p>
          ) : (
            <form onSubmit={sendProposal} style={{ marginTop: 14 }}>
              <label>Proposed Rate (₹)</label>
              <input name="rate" type="number" value={proposal.rate} onChange={handleChange} required />
              <label>Deliverables</label>
              <input name="deliverables" value={proposal.deliverables} onChange={handleChange} placeholder="1 Reel, 2 Stories" />
              <label>Message to Brand</label>
              <textarea name="message" rows="3" value={proposal.message} onChange={handleChange} />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Proposal</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default CampaignDetails;
