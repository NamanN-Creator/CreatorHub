import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Proposals from './pages/Proposals';

// Logged-in pages: dark sidebar on the left, page content on the right.
// If nobody is logged in this redirects to /login.
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/campaigns" element={<PrivateRoute><Campaigns /></PrivateRoute>} />
        <Route path="/campaigns/:id" element={<PrivateRoute><CampaignDetails /></PrivateRoute>} />
        <Route path="/proposals" element={<PrivateRoute><Proposals /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
