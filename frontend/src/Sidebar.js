import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const NAV = {
  creator: [
    ['/dashboard', 'Dashboard'],
  ],
  brand: [
    ['/dashboard', 'Dashboard'],
  ],
  talent: [
    ['/dashboard', 'Dashboard'],
  ],
  finance: [
    ['/dashboard', 'Dashboard'],
  ],
};

export const ROLE_LABEL = {
  creator: 'Creator',
  brand: 'Brand Rep',
  talent: 'Talent Manager',
  finance: 'Finance Manager',
};

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CreatorHub</div>

      <nav className="sidebar-nav">
        {NAV[user.role].map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{ROLE_LABEL[user.role]}</div>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={handleLogout}>Log out</button>
      </div>
    </aside>
  );
}

export default Sidebar;
