import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import StudentDashboard from './pages/StudentDashboard';
import RecruiterPortal from './pages/RecruiterPortal';
import AssessmentEngine from './pages/AssessmentEngine';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

// --- Layout Component ---
function DashboardLayout() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const selectedTheme = {
    primaryColor: user?.tenantConfig?.primaryColor || "#0D2E5C",
    accentColor: user?.tenantConfig?.accentColor || "#F26E21",
    logo: user?.tenantName || "AssessPro"
  };

  return (
    <div className="dashboard-grid" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        {/* Portal branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              backgroundColor: selectedTheme.primaryColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}
          >
            A
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', lineHeight: 1 }}>AssessPro AI</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SaaS EdTech Platform</span>
          </div>
        </div>

        {/* Navigation tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', flex: 1 }}>
          <button 
            className="btn btn-primary"
            style={{ 
              justifyContent: 'flex-start', 
              background: `linear-gradient(135deg, ${selectedTheme.primaryColor}, #1e293b)`
            }}
          >
            <LayoutDashboard size={18} />
            <span>Workspace</span>
          </button>
        </div>

        {/* User profile footer controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }}>
              <User size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role: {user?.role}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={toggleTheme}
              style={{ flex: 1, padding: '0.4rem' }}
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={logout}
              style={{ flex: 2, padding: '0.4rem', fontSize: '0.75rem', backgroundColor: 'var(--danger-color, #ef4444)', color: 'white', border: 'none' }}
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main dashboard content panel */}
      <main className="dashboard-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {user?.role === 'STUDENT' ? 'Student Placement Portal' : user?.role === 'RECRUITER' ? 'Recruiter Candidates Center' : 'Platform Administration'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Tenant: <strong style={{ color: selectedTheme.accentColor }}>{selectedTheme.logo}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>
              <ShieldCheck size={14} style={{ marginRight: '0.25rem' }} /> Active License Verified
            </span>
          </div>
        </header>

        {/* Render child routes here */}
        <Outlet />
      </main>
    </div>
  );
}


// --- Protected Route Wrapper ---
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or an unauthorized page
  }

  return <DashboardLayout />;
};


// --- Main App Routing ---
export default function App() {
  const { login, isAuthenticated } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={login} />
        } />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Default route redirect based on role */}
          <Route path="/" element={<RoleRedirect />} />
          
          <Route path="/student" element={
            <StudentDashboard 
              tenantName="" 
              tenantConfig={{}} 
              onStartExam={() => window.location.href = '/compiler'} 
            />
          } />
          <Route path="/recruiter" element={<RecruiterPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Compiler Route (Fullscreen, no sidebar) */}
        <Route path="/compiler" element={
          <ProtectedRoute allowedRoles={['STUDENT']} /> // Protect but render Assessment Engine directly? 
          // Wait, DashboardLayout provides the sidebar.
        }>
            {/* We'll handle compiler differently if we want no sidebar */}
        </Route>
        
        <Route path="/compiler/full" element={
            <AssessmentEngine onBackToDashboard={() => window.location.href = '/student'} />
        } />

      </Routes>
    </>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'STUDENT') return <Navigate to="/student" />;
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter" />;
  return <Navigate to="/admin" />;
}
