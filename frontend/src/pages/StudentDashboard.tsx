import { useState } from 'react';
import { 
  Award, 
  Terminal, 
  FileText, 
  Brain, 
  CheckCircle, 
  Clock, 
  Play, 
  Upload, 
  Sparkles
} from 'lucide-react';

interface StudentDashboardProps {
  tenantName: string;
  tenantConfig?: {
    primaryColor: string;
    accentColor: string;
  };
  onStartExam: () => void;
}

export default function StudentDashboard({ tenantName, tenantConfig, onStartExam }: StudentDashboardProps) {
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [skillsFound, setSkillsFound] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setAnalyzingResume(true);
    // Simulate AI parsing
    setTimeout(() => {
      setResumeScore(84);
      setSkillsFound(["Java SE", "Python", "SQL", "React", "Docker", "Algorithms"]);
      setAiSuggestions([
        "Highlight your experience in the REST APIs project.",
        "Add AWS or Google Cloud foundational certification details.",
        "Great: Your profile details match Accenture & Capgemini requirements!"
      ]);
      setAnalyzingResume(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dynamic branding header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2.5rem', 
          background: `linear-gradient(135deg, ${tenantConfig?.primaryColor || '#0f172a'} 0%, #1e293b 100%)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '16px'
        }}
      >
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>First Deployment Customer</span>
          <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)' }}>Welcome to AssessPro AI</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>Scoped Workspace: <strong>{tenantName}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>First deployment target</p>
            <p style={{ fontWeight: '600' }}>JAIN Global Campus, Bengaluru</p>
          </div>
        </div>
      </div>

      {/* Analytics & Placement Readiness */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Placement readiness Score ring */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="readiness-ring">
            <svg width="140" height="140" className="score-circle">
              <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle cx="70" cy="70" r="55" fill="none" stroke="var(--primary)" strokeWidth="10" 
                      strokeDasharray="345" strokeDashoffset="69" strokeLinecap="round" />
            </svg>
            <span className="score-value">80%</span>
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ color: 'var(--accent)' }} /> Placement Readiness
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              Your aggregate score indicates high capability readiness. Excellent coding fundamentals.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Coding: Elite</span>
              <span className="badge badge-primary">Aptitude: High</span>
            </div>
          </div>
        </div>

        {/* Cognitive Scorecard Breakdowns */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Sub-Section Readiness Scores</h3>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Coding & Algorithms</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>88%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--primary)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Quantitative & Logical Aptitude</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>76%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '76%', height: '100%', backgroundColor: 'var(--success)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Communication & Personality</span>
              <span style={{ fontWeight: 600, color: 'var(--warning)' }}>82%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', backgroundColor: 'var(--warning)' }}></div>
            </div>
          </div>

        </div>

      </div>

      {/* AI Performance Coach Insights */}
      <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>
          <Sparkles /> AI Performance Coach recommendations
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Topic Focus:</strong> Your Trees & Graphs performance is 12% lower than dynamic programming. Solve 5 problems on BST/Heap structures.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Company Preparation:</strong> You are 92% ready for TCS Digital and 78% ready for Google Technical Assessment.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines:</strong> Comprehensive Placement Coding test is scheduled for next Friday. Run practice tests.
          </li>
        </ul>
      </div>

      {/* Two column interactive section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Scheduled Assessments */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Active & Upcoming Assessment Panels</h3>
            <span className="badge badge-primary">2 Active Tests</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Assessment Card 1 */}
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: '8px', 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>AssessPro National Coding Challenge 2026</h4>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 90 Mins</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Terminal size={14} /> Languages: Java, Python, C++</span>
                </div>
              </div>
              <button onClick={onStartExam} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                <Play size={14} /> Start assessment
              </button>
            </div>

            {/* Assessment Card 2 */}
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: '8px', 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: 0.75
            }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Aptitude Diagnostic Assessment - Batch 2026</h4>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 45 Mins</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Brain size={14} /> Topic: Quantitative Aptitude</span>
                </div>
              </div>
              <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>
                <CheckCircle size={14} style={{ marginRight: '0.25rem' }} /> Completed
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: AI Resume Scorer */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <FileText /> AI Resume Scorer
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Upload your resume (.pdf, .docx) to analyze keyword compatibility with corporate placement profiles.
          </p>

          <label className="btn btn-secondary" style={{ flexDirection: 'column', padding: '2rem 1rem', borderStyle: 'dashed', cursor: 'pointer' }}>
            <Upload style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {analyzingResume ? 'Analyzing Resume...' : 'Select Resume File'}
            </span>
            <input type="file" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={analyzingResume} />
          </label>

          {resumeScore !== null && (
            <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Resume Score:</span>
                <span className="badge badge-success">{resumeScore}/100</span>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Identified Keywords:</p>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {skillsFound.map(sk => <span key={sk} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{sk}</span>)}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Optimization Tips:</p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {aiSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
