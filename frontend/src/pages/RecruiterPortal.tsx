import { useState } from 'react';
import { 
  Search, 
  Download, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  UserCheck,
  Check
} from 'lucide-react';

const mockStudents = [
  { id: 1, name: "Arjun Mehta", dept: "CSE", score: 92, coding: 95, aptitude: 89, skills: ["React", "TypeScript", "Node.js"] },
  { id: 2, name: "Sneha Rao", dept: "ISE", score: 87, coding: 90, aptitude: 84, skills: ["Java", "Spring Boot", "SQL"] },
  { id: 3, name: "Kiran Kumar", dept: "ECE", score: 79, coding: 75, aptitude: 82, skills: ["C++", "Embedded Systems"] },
  { id: 4, name: "Pooja Hegde", dept: "CSE", score: 94, coding: 98, aptitude: 90, skills: ["Python", "TensorFlow", "Django"] },
  { id: 5, name: "Vikram Singh", dept: "ME", score: 68, coding: 52, aptitude: 74, skills: ["AutoCAD", "MATLAB"] }
];

export default function RecruiterPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [minScore, setMinScore] = useState(70);
  const [scheduled, setScheduled] = useState(false);

  const filteredStudents = mockStudents.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          st.skills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === 'All' || st.dept === selectedDept;
    const matchesScore = st.score >= minScore;
    return matchesSearch && matchesDept && matchesScore;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview stats for corporate recruitment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(14,165,233,0.1)', color: 'var(--primary)' }}>
            <Briefcase />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Open Placement Drives</p>
            <h4 style={{ fontSize: '1.5rem' }}>14 Active</h4>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
            <UserCheck />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Shortlisted Candidates</p>
            <h4 style={{ fontSize: '1.5rem' }}>186 Students</h4>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
            <TrendingUp />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>JAIN Avg Placement Score</p>
            <h4 style={{ fontSize: '1.5rem' }}>78.4 / 100</h4>
          </div>
        </div>

      </div>

      {/* Recruiter Interface workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Student Finder Database */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Verify & Filter Placement Candidates</h3>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Download size={14} /> Export CSV List
            </button>
          </div>

          {/* Search bar and Filters header */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search candidates by name or technical skills..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ width: '180px' }}>
              <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                <option value="All">All Departments</option>
                <option value="CSE">Computer Science</option>
                <option value="ISE">Information Science</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
              </select>
            </div>

            <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Min Score: {minScore}%</label>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={minScore} 
                onChange={e => setMinScore(Number(e.target.value))}
                style={{ height: '6px', padding: 0 }}
              />
            </div>

          </div>

          {/* Candidates table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Dept</th>
                  <th>Placement Score</th>
                  <th>Coding Score</th>
                  <th>Aptitude Score</th>
                  <th>Key Skills</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(st => (
                    <tr key={st.id}>
                      <td style={{ fontWeight: 600 }}>{st.name}</td>
                      <td>{st.dept}</td>
                      <td>
                        <span className={`badge ${st.score >= 85 ? 'badge-success' : 'badge-primary'}`}>
                          {st.score}%
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{st.coding}%</td>
                      <td>{st.aptitude}%</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {st.skills.map(sk => (
                            <span key={sk} className="badge btn-secondary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No eligible candidates match criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Schedule Campus Drive */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <Calendar /> Schedule Recruitment Drive
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Coordinate mock assessments or schedule coding assessment panels for JAIN Global Campus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Test Profile</label>
              <select>
                <option>Accenture Mock Coding Test</option>
                <option>TCS NQT Prep Assessment</option>
                <option>Custom Technical Hackathon</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Target Batches</label>
              <select>
                <option>2026 Graduating Batch (CSE/ISE)</option>
                <option>All Engineering Streams</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Target Date</label>
              <input type="date" defaultValue="2026-07-15" />
            </div>

            <button 
              onClick={() => {
                setScheduled(true);
                setTimeout(() => setScheduled(false), 2000);
              }} 
              className="btn btn-primary"
            >
              {scheduled ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Check size={16} /> Scheduled Drive
                </span>
              ) : 'Launch Assessment Drive'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
