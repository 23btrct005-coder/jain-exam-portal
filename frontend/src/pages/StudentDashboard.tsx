import { useState } from 'react';
import { 
  Award, 
  Terminal, 
  FileText, 
  Brain, 
  Clock, 
  Play, 
  Upload, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

interface StudentDashboardProps {
  tenantName?: string;
  tenantConfig?: {
    primaryColor?: string;
    accentColor?: string;
  };
  onStartExam: () => void;
}

export default function StudentDashboard({ onStartExam }: StudentDashboardProps) {
  const { user } = useAuth();
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [skillsFound, setSkillsFound] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const tenantConfig = user?.tenantConfig || { primaryColor: '#0f172a', accentColor: '#38bdf8' };
  const tenantName = user?.tenantName || 'AssessPro';

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setAnalyzingResume(true);
    
    try {
      const file = e.target.files[0];
      // In a real app, we would upload the file to S3 and pass the URL to the API.
      // For now, we simulate sending the text content or document to the AI service.
      const res = await apiClient.post('/ai/analyze-resume', {
        resumeUrl: file.name
      });
      
      setResumeScore(res.data.score);
      setSkillsFound(res.data.missingSkills || ["Java SE", "Python", "SQL", "React", "Docker", "Algorithms"]);
      setAiSuggestions(res.data.recommendations || [
        "Highlight your experience in the REST APIs project.",
        "Add AWS or Google Cloud foundational certification details.",
        "Great: Your profile details match Accenture & Capgemini requirements!"
      ]);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze resume.');
    } finally {
      setAnalyzingResume(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dynamic branding header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2.5rem', 
          background: `linear-gradient(135deg, ${tenantConfig.primaryColor} 0%, #1e293b 100%)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
            Welcome back, {user?.firstName}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
            {tenantName} Placement Preparation Portal
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Placement Readiness</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: tenantConfig.accentColor }}>72%</p>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(${tenantConfig.accentColor} 72%, #334155 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '45px', height: '45px', backgroundColor: '#1e293b', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Active Assessments */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal className="text-sky-400" /> Active Assessments
            </h3>
            <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)' }}>2 Pending</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>TCS NQT Mock Test 1</strong>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> 90 mins</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Aptitude, Logical Reasoning, and Basic Coding.</p>
              <button className="btn btn-primary" onClick={onStartExam} style={{ width: '100%', justifyContent: 'center' }}>
                <Play size={16} style={{ marginRight: '0.5rem' }} /> Start Assessment
              </button>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Accenture Advanced Coding</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due in 2 days</span>
              </div>
              <button className="btn btn-secondary" onClick={onStartExam} style={{ width: '100%', justifyContent: 'center' }}>
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* AI Resume Grader */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, rgba(15,23,42,0.5) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText className="text-indigo-400" /> AI Resume Grader
            </h3>
            {resumeScore && (
              <span className="badge badge-success">Score: {resumeScore}/100</span>
            )}
          </div>
          
          {!resumeScore ? (
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
              <Brain size={40} className="text-indigo-500 mb-3 mx-auto" opacity={0.8} />
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Upload your resume to get instant AI feedback on missing keywords for top product companies.
              </p>
              
              <label className="btn btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                <Upload size={16} style={{ marginRight: '0.5rem' }} />
                {analyzingResume ? 'Analyzing...' : 'Upload PDF'}
                <input type="file" accept=".pdf" style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} onChange={handleResumeUpload} disabled={analyzingResume} />
              </label>
            </div>
          ) : (
            <div className="animate-fade-in space-y-4">
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Sparkles size={14} className="inline text-yellow-400 mr-1"/> Detected Skills:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skillsFound.map(skill => (
                    <span key={skill} className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>AI Recommendations:</p>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {aiSuggestions.map((suggestion, i) => (
                    <li key={i} style={{ listStyleType: 'disc' }}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <button className="btn btn-secondary mt-2 w-full text-center" onClick={() => setResumeScore(null)}>
                Upload Updated Version
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Performance Overview */}
      <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award className="text-yellow-500" /> Skill Proficiency Matrix
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Data Structures', score: 85, color: '#38bdf8' },
            { name: 'Algorithms', score: 68, color: '#f59e0b' },
            { name: 'Database Design', score: 92, color: '#10b981' },
            { name: 'Quantitative Aptitude', score: 55, color: '#ef4444' }
          ].map(skill => (
            <div key={skill.name} style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{skill.name}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: skill.color }}>{skill.score}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${skill.score}%`, height: '100%', backgroundColor: skill.color, borderRadius: '3px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
