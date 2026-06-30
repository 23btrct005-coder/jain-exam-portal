import { useState } from 'react';
import { 
  User, 
  Terminal, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LayoutDashboard
} from 'lucide-react';
import StudentDashboard from './pages/StudentDashboard.tsx';
import RecruiterPortal from './pages/RecruiterPortal.tsx';
import AssessmentEngine from './pages/AssessmentEngine.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

interface TenantTheme {
  primaryColor: string;
  accentColor: string;
  logo: string;
}

const mockTenants: Record<string, TenantTheme> = {
  jain: {
    primaryColor: "#0D2E5C", // JAIN blue
    accentColor: "#F26E21",  // JAIN Orange
    logo: "🛡️ JAIN"
  },
  oxford: {
    primaryColor: "#002147", // Oxford Blue
    accentColor: "#C5A059",  // Muted gold
    logo: "🎓 Oxford"
  },
  mit: {
    primaryColor: "#A31D1D", // MIT Red
    accentColor: "#8A8B8C",  // Slate grey
    logo: "🔬 MIT"
  }
};

export default function App() {
  const [currentTenant, setCurrentTenant] = useState<string>('jain');
  const [role, setRole] = useState<'STUDENT' | 'RECRUITER' | 'ADMIN'>('STUDENT');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const selectedTheme = mockTenants[currentTenant];

  const handleStartExam = () => {
    setActiveTab('compiler');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // If in compiler mode, render the compiler full-screen
  if (activeTab === 'compiler') {
    return (
      <AssessmentEngine onBackToDashboard={() => setActiveTab('dashboard')} />
    );
  }

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

        {/* Scoped tenant information switch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Simulated Tenant:</label>
          <select 
            value={currentTenant} 
            onChange={e => setCurrentTenant(e.target.value)}
            style={{ padding: '0.4rem 0.5rem', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.85rem' }}
          >
            <option value="jain">JAIN Global Campus</option>
            <option value="oxford">Oxford College</option>
            <option value="mit">MIT Campus</option>
          </select>
        </div>

        {/* Navigation tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', flex: 1 }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'dashboard' ? `linear-gradient(135deg, ${selectedTheme.primaryColor}, #1e293b)` : undefined 
            }}
          >
            <LayoutDashboard size={18} />
            <span>Workspace</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={() => setActiveTab('compiler')}
            style={{ justifyContent: 'flex-start' }}
          >
            <Terminal size={18} />
            <span>Coding Sandbox</span>
          </button>
        </div>

        {/* User profile footer controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }}>
              <User size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>S. Srinivasan</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role: {role}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              className={`btn btn-secondary`} 
              onClick={toggleTheme}
              style={{ flex: 1, padding: '0.4rem' }}
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                if (role === 'STUDENT') setRole('RECRUITER');
                else if (role === 'RECRUITER') setRole('ADMIN');
                else setRole('STUDENT');
              }}
              style={{ flex: 2, padding: '0.4rem', fontSize: '0.75rem' }}
            >
              Switch Role
            </button>
          </div>

        </div>

      </aside>

      {/* Main dashboard content panel */}
      <main className="dashboard-content">
        
        {/* Shell dashboard header banner */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {role === 'STUDENT' ? 'Student Placement Portal' : role === 'RECRUITER' ? 'Recruiter Candidates Center' : 'Platform Administration'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Scoped Tenant Branding: <strong style={{ color: selectedTheme.accentColor }}>{selectedTheme.logo}</strong>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>
              <ShieldCheck size={14} style={{ marginRight: '0.25rem' }} /> Active License Verified
            </span>
          </div>
        </header>

        {/* Conditional role render panels */}
        {role === 'STUDENT' && (
          <StudentDashboard 
            tenantName={currentTenant === 'jain' ? 'JAIN Global Campus' : currentTenant === 'oxford' ? 'Oxford College' : 'MIT Campus'} 
            tenantConfig={selectedTheme}
            onStartExam={handleStartExam}
          />
        )}

        {role === 'RECRUITER' && (
          <RecruiterPortal />
        )}

        {role === 'ADMIN' && (
          <AdminDashboard />
        )}

      </main>

    </div>
  );
}
