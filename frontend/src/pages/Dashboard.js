import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const count = (arr, fn) => arr.filter(fn).length;
const sum = (arr, fn) => arr.reduce((t, x) => t + (fn(x) || 0), 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// A "Due Sep 24" / "Overdue" badge for a task deadline.
const dueBadge = (deadline) => {
  if (!deadline) return null;
  const overdue = new Date(deadline) < new Date(new Date().toDateString());
  return overdue ? { text: 'Overdue', cls: 'overdue' } : { text: `Due ${fmtDate(deadline)}`, cls: 'due' };
};

function Item({ title, sub, sub2, badge, right, to }) {
  return (
    <div className="item-card">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="item-title">{title}</div>
          {sub && <div className="item-sub">{sub}</div>}
          {sub2 && <div className="item-sub">{sub2}</div>}
          {badge && <span className={`badge ${badge.cls}`}>{badge.text}</span>}
        </div>
        {(right || to) && (
          <div className="item-right">
            {right && <div className="item-amount">{right}</div>}
            {to && <Link to={to} className="btn btn-secondary">View</Link>}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ campaigns: [], proposals: [], tasks: [], invoices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const want = {
      creator: ['campaigns', 'proposals', 'tasks', 'invoices'],
      brand: ['campaigns', 'proposals'],
      talent: ['campaigns', 'tasks'],
      finance: ['invoices'],
    }[user.role];
    Promise.all(
      want.map((k) => api.get(`/${k}`).then((r) => [k, r.data]).catch(() => [k, []]))
    ).then((entries) => {
      setData((d) => ({ ...d, ...Object.fromEntries(entries) }));
      setLoading(false);
    });
  }, [user.role]);

  const { campaigns, proposals, tasks, invoices } = data;
  const byDeadline = (a, b) => new Date(a.deadline) - new Date(b.deadline);
  const openTasks = tasks.filter((t) => t.status !== 'Completed' && t.deadline).sort(byDeadline);

  let subtitle, stats, actions = [], leftTitle, leftLink, left = [], rightTitle, right = [];

  if (user.role === 'creator') {
    subtitle = "Here's what's happening with your creator work.";
    stats = [
      ['Active Campaigns', count(proposals, (p) => p.status === 'accepted')],
      ['Pending Proposals', count(proposals, (p) => p.status === 'pending')],
      ['Active Tasks', count(tasks, (t) => t.status !== 'Completed')],
      ['Total Earnings', money(sum(invoices, (i) => (i.status === 'Paid' ? i.amount : 0)))],
    ];
    leftTitle = 'Recommended Campaigns';
    leftLink = '/campaigns';
    left = campaigns.slice(0, 3).map((c) => ({
      key: c._id, title: c.name, sub: c.brand, sub2: [c.niche, c.platform].filter(Boolean).join(' · '),
      right: c.budget, to: `/campaigns/${c._id}`,
    }));
    rightTitle = 'Upcoming Deadlines';
    right = openTasks.slice(0, 3).map((t) => ({
      key: t._id, title: t.title, sub: t.campaign?.name, badge: dueBadge(t.deadline),
    }));
  } else if (user.role === 'brand') {
    subtitle = "Here's what's happening across your campaigns.";
    const accepted = proposals.filter((p) => p.status === 'accepted');
    stats = [
      ['Active Campaigns', count(campaigns, (c) => c.status === 'published')],
      ['Pending Proposals', count(proposals, (p) => p.status === 'pending')],
      ['Creators Collaborating', new Set(accepted.map((p) => p.creator?._id)).size],
      ['Total Campaign Spend', money(sum(accepted, (p) => Number(p.rate)))],
    ];
    actions = [['/campaigns', '+ New Campaign', true], ['/proposals', 'Review Proposals']];
    leftTitle = 'Recent Campaigns';
    leftLink = '/campaigns';
    left = campaigns.slice(0, 3).map((c) => {
      const n = count(proposals, (p) => p.campaign?._id === c._id);
      return {
        key: c._id, title: c.name,
        sub: c.status === 'draft' ? 'Draft' : `${n} proposals received`,
        sub2: [c.niche, c.platform].filter(Boolean).join(' · '),
        badge: { text: c.status === 'published' ? 'Live' : 'Draft', cls: c.status === 'published' ? 'published' : 'draft' },
      };
    });
    rightTitle = 'Pending Actions';
    right = proposals.filter((p) => p.status === 'pending').slice(0, 3).map((p) => ({
      key: p._id, title: `${p.creator?.name || 'A creator'} sent a proposal`, sub: p.campaign?.name,
    }));
  } else if (user.role === 'talent') {
    subtitle = 'Overview of creators and campaigns under your management.';
    stats = [
      ['Active Campaigns', count(campaigns, (c) => c.status === 'published')],
      ['Managed Creators', new Set(tasks.map((t) => t.creator?._id)).size],
      ['Pending Tasks', count(tasks, (t) => t.status !== 'Completed')],
      ['Campaign Progress', tasks.length ? `${Math.round((count(tasks, (t) => t.status === 'Completed') / tasks.length) * 100)}%` : '0%'],
    ];
    leftTitle = 'Upcoming Deadlines';
    left = openTasks.slice(0, 3).map((t) => ({
      key: t._id, title: t.title, sub: [t.creator?.name, t.campaign?.name].filter(Boolean).join(' · '), badge: dueBadge(t.deadline),
    }));
    rightTitle = 'Recent Activity';
    right = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3).map((t) => ({
      key: t._id, title: `${t.creator?.name || 'Creator'}: ${t.title}`, sub: t.status,
    }));
  } else {
    subtitle = 'Invoices and payments across all campaigns.';
    stats = [
      ['Invoices Raised', invoices.length],
      ['Outstanding', money(sum(invoices, (i) => (i.status === 'Pending' || i.status === 'Processing' ? i.amount : 0)))],
      ['Paid Out', money(sum(invoices, (i) => (i.status === 'Paid' ? i.amount : 0)))],
      ['Failed Payments', count(invoices, (i) => i.status === 'Failed')],
    ];
    actions = [['/invoices', 'Manage Invoices', true]];
    leftTitle = 'Recent Invoices';
    leftLink = '/invoices';
    left = [...invoices].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3).map((i) => ({
      key: i._id, title: i.creator?.name || 'Creator', sub: i.campaign?.name, right: money(i.amount),
      badge: { text: i.status, cls: i.status },
    }));
    rightTitle = 'Pending Payments';
    right = invoices.filter((i) => i.status === 'Pending' || i.status === 'Processing').slice(0, 3).map((i) => ({
      key: i._id, title: `${money(i.amount)} · ${i.creator?.name || 'Creator'}`, sub: i.campaign?.name,
    }));
  }

  return (
    <div className="page">
      <h1 className="page-title">{greeting()}, {user.name.split(' ')[0]}</h1>
      <p className="page-sub">{subtitle}</p>

      <div className="stat-grid">
        {stats.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{loading ? '–' : value}</div>
          </div>
        ))}
      </div>

      {actions.length > 0 && (
        <div className="action-row">
          {actions.map(([to, label, primary]) => (
            <Link key={to + label} to={to} className={`btn ${primary ? 'btn-primary' : 'btn-secondary'}`}>{label}</Link>
          ))}
        </div>
      )}

      <div className="dash-cols">
        <div>
          <h3 className="dash-section-title">
            {leftTitle}
            {leftLink && <Link to={leftLink}>See all</Link>}
          </h3>
          {!loading && left.length === 0 && <div className="empty">Nothing here yet.</div>}
          {left.map(({ key, ...rest }) => <Item key={key} {...rest} />)}
        </div>
        <div>
          <h3 className="dash-section-title">{rightTitle}</h3>
          {!loading && right.length === 0 && <div className="empty">Nothing here yet.</div>}
          {right.map(({ key, ...rest }) => <Item key={key} {...rest} />)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
