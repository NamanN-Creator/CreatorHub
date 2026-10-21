import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Temporary landing page after login — replaced by the real dashboards next.
function Home() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="main">
      <h1 className="page-title">Signed in as {user.name}</h1>
      <p className="page-sub">Role: {user.role}. Dashboards come next.</p>
      <button type="button" className="btn-primary" onClick={logout}>Log out</button>
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
        <Route path="/dashboard" element={<Home />} />
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
