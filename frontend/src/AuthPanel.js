// Right-hand dark panel shared by Login and Register. Static — no animation.
const CARDS = [
  { title: 'Monsoon Essentials', brand: 'Petal & Pine', tone: 'a' },
  { title: 'Desk Setup Refresh', brand: 'Northline Co.', tone: 'b', badge: 'Applied' },
  { title: 'Everyday Carry', brand: 'Fieldmark', tone: 'c' },
  { title: 'Home Brew Launch', brand: 'Roast & Co.', tone: 'd' },
  { title: 'Trail Ready', brand: 'Altitude', tone: 'e', badge: 'Invited' },
  { title: 'City Commute', brand: 'Loop Cycles', tone: 'f' },
];

function AuthPanel() {
  return (
    <div className="auth-right">
      <div className="auth-float-grid">
        {CARDS.map((c) => (
          <div className={`float-card tone-${c.tone}`} key={c.title}>
            <div className="float-thumb">
              {c.badge && <span className="float-badge">{c.badge}</span>}
            </div>
            <div className="float-title">{c.title}</div>
            <div className="float-brand">{c.brand}</div>
          </div>
        ))}
      </div>
      <div className="auth-right-copy">
        <h2>Manage all your brand collabs in CreatorHub</h2>
        <p>Discover campaigns, send proposals and track payouts in one place.</p>
      </div>
    </div>
  );
}

export default AuthPanel;
