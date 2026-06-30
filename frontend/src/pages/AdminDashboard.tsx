import { useState } from 'react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { 
  Building, 
  Users, 
  Plus, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([
    { id: 1, name: "JAIN Global Campus", subdomain: "jain", students: 1420, activeExams: 3, plan: "Enterprise Premium" },
    { id: 2, name: "Bengaluru Technology College", subdomain: "btc", students: 850, activeExams: 1, plan: "Pro Growth" },
    { id: 3, name: "Kanakapura Engineering Institute", subdomain: "kei", students: 430, activeExams: 0, plan: "Standard Seat" }
  ]);

  const [aiLoading, setAiLoading] = useState(false);
  const [generatedQ, setGeneratedQ] = useState<any>(null);

  const [newTenant, setNewTenant] = useState({ name: '', subdomain: '', plan: 'Standard Seat' });

  const createTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.subdomain) return;
    setTenants(prev => [...prev, {
      id: prev.length + 1,
      name: newTenant.name,
      subdomain: newTenant.subdomain.toLowerCase(),
      students: 0,
      activeExams: 0,
      plan: newTenant.plan
    }]);
    setNewTenant({ name: '', subdomain: '', plan: 'Standard Seat' });
  };

  const triggerAIGenerator = async () => {
    setAiLoading(true);
    try {
      const res = await apiClient.post('/ai/generate-question', {
        topic: "Data Structures",
        difficulty: "Medium",
        type: "CODING"
      });
      setGeneratedQ(res.data.question);
      toast.success('Question generated successfully by AI!');
    } catch (error) {
      toast.error('Failed to generate question');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview Analytics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(14,165,233,0.1)', color: 'var(--primary)' }}>
            <Building />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Active Tenants</p>
            <h4 style={{ fontSize: '1.5rem' }}>{tenants.length} Colleges</h4>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
            <Users />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Platform Students</p>
            <h4 style={{ fontSize: '1.5rem' }}>2,700 seats</h4>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
            <DollarSign />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monthly SaaS Billing</p>
            <h4 style={{ fontSize: '1.5rem' }}>$12,400</h4>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: SaaS Tenants Management */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Active University & College Tenants</h3>
          
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>College Name</th>
                  <th>Subdomain</th>
                  <th>Seat Count</th>
                  <th>Active Exams</th>
                  <th>Licensing Tier</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td><code style={{ color: 'var(--primary)' }}>{t.subdomain}.assesspro.ai</code></td>
                    <td>{t.students} students</td>
                    <td>{t.activeExams} exams</td>
                    <td>
                      <span className="badge badge-primary">{t.plan}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Create/Onboard college */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Onboard New College/Campus</h3>
          <form onSubmit={createTenant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>College Name</label>
              <input 
                type="text" 
                placeholder="e.g. Jain School of Engineering"
                value={newTenant.name}
                onChange={e => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Access Subdomain</label>
              <input 
                type="text" 
                placeholder="e.g. jainschool"
                value={newTenant.subdomain}
                onChange={e => setNewTenant(prev => ({ ...prev, subdomain: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Subscription tier</label>
              <select 
                value={newTenant.plan}
                onChange={e => setNewTenant(prev => ({ ...prev, plan: e.target.value }))}
              >
                <option value="Standard Seat">Standard Seat ($5/student)</option>
                <option value="Pro Growth">Pro Growth ($9/student)</option>
                <option value="Enterprise Premium">Enterprise Premium (Flat rate)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} /> Register SaaS Tenant
            </button>
          </form>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Interactive AI Question Generator Tool */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1rem' }}>
            <Sparkles style={{ color: 'var(--accent)' }} /> AI Question Bank Generator
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Instantly create premium assessment panels scoping coding tests, quantitative aptitude, or technical MCQs.
          </p>

          <button onClick={triggerAIGenerator} className="btn btn-accent" disabled={aiLoading} style={{ marginBottom: '1rem' }}>
            {aiLoading ? 'Generating with AI...' : 'Create Question from pool'}
          </button>

          {generatedQ && (
            <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fff' }}>{generatedQ.title}</strong>
                <span className="badge badge-success">{generatedQ.difficulty}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{generatedQ.content}</p>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Topic: {generatedQ.topic}</span>
            </div>
          )}
        </div>

        {/* Aggregate Platform Billing Overview */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Branch Performance Analytics</h3>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Computer Science (JAIN)</span>
              <span style={{ fontWeight: 600 }}>85% Avg Readiness</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--primary)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Electronics (JAIN)</span>
              <span style={{ fontWeight: 600 }}>74% Avg Readiness</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '74%', height: '100%', backgroundColor: 'var(--success)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Mechanical (JAIN)</span>
              <span style={{ fontWeight: 600 }}>62% Avg Readiness</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', backgroundColor: 'var(--warning)' }}></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
