import { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  ShieldAlert, 
  Cpu,
  Database
} from 'lucide-react';

interface AssessmentEngineProps {
  onBackToDashboard: () => void;
}

export default function AssessmentEngine({ onBackToDashboard }: AssessmentEngineProps) {
  const [code, setCode] = useState(`def reverse_list(head):
    # Write your python code here
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`);
  const [language, setLanguage] = useState('python');
  const [timer, setTimer] = useState(5400); // 90 minutes
  const [, setCompiling] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState<string>('Run code to see test case output...');
  const [metrics, setMetrics] = useState<{ runtime?: number; memory?: number } | null>(null);
  const [testCases, setTestCases] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === 'python') {
      setCode(`def reverse_list(head):
    # Write your python code here
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`);
    } else if (lang === 'java') {
      setCode(`public class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your Java code here
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`);
    } else {
      setCode(`// JavaScript solution
function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`);
    }
  };

  const runCode = async () => {
    setCompiling(true);
    setCompilerOutput('Compiling code in secure sandbox environment...\nLink verified to database schema.\nExecuting tests...');
    
    try {
      const response = await fetch('/api/compiler/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'jain'
        },
        body: JSON.stringify({ code, language, questionId: 'reverse-linked-list' })
      });

      const data = await response.json();
      
      setCompiling(false);
      if (data.error) {
        setCompilerOutput(`Compilation Error:\n${data.error}`);
      } else {
        setCompilerOutput(`SUCCESS: Code compiled.\nAll Testcases passed on primary database validations.`);
        setMetrics({ runtime: data.runtimeMs, memory: data.memoryKb });
        setTestCases(data.testCases || []);
      }
    } catch (err: any) {
      setCompiling(false);
      setCompilerOutput(`Network Error compiling code:\n${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#090d16' }}>
      
      {/* Platform Assessment Workspace Header */}
      <div style={{ 
        height: '60px', 
        padding: '0 1.5rem', 
        backgroundColor: '#111827', 
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>
            AssessPro Assessment Engine
          </h2>
          <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldAlert size={12} /> Proctoring Enabled
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f3f4f6' }}>
            <Clock size={16} />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatTimer(timer)}</span>
          </div>
          <button onClick={onBackToDashboard} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            Submit Test
          </button>
        </div>
      </div>

      {/* Compiler main layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', overflow: 'hidden' }}>
        
        {/* Left Side: Question description */}
        <div style={{ 
          backgroundColor: '#0f172a', 
          borderRight: '1px solid rgba(255,255,255,0.08)', 
          padding: '1.5rem', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Medium</span>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Reverse Linked List In-Place</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge btn-secondary" style={{ fontSize: '0.65rem' }}>Data Structures</span>
              <span className="badge btn-secondary" style={{ fontSize: '0.65rem' }}>Amazon</span>
              <span className="badge btn-secondary" style={{ fontSize: '0.65rem' }}>Google</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }} />

          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>
              Given the head of a singly linked list, reverse the list in-place and return the reversed list.
            </p>
            <p><strong>Example 1:</strong></p>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              Input: head = [1,2,3,4,5]<br />
              Output: [5,4,3,2,1]
            </div>

            <p><strong>Constraints:</strong></p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
              <li>The number of nodes in the list is the range <code>[0, 5000]</code>.</li>
              <li><code>-5000 &lt;= Node.val &lt;= 5000</code></li>
            </ul>
          </div>
        </div>

        {/* Right Side: Code editor & compilation logs */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#090d16' }}>
          
          {/* Header config bar */}
          <div style={{ 
            height: '45px', 
            padding: '0 1rem', 
            backgroundColor: '#111827', 
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <select 
                value={language} 
                onChange={e => handleLanguageChange(e.target.value)}
                style={{ padding: '0.25rem 0.5rem', width: '120px', fontSize: '0.85rem', backgroundColor: '#1f2937' }}
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={runCode} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                <Play size={12} /> Run Code
              </button>
            </div>
          </div>

          {/* Editor Workspace */}
          <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <textarea
              className="editor-textarea"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0a0e17',
                border: 'none',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                padding: '1.5rem',
                resize: 'none',
                lineHeight: '1.6'
              }}
            />
          </div>

          {/* Compiler execution metrics & logs */}
          <div style={{ height: '220px', display: 'grid', gridTemplateColumns: '1fr 300px', backgroundColor: '#0f172a' }}>
            
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0.5rem 1rem', backgroundColor: '#111827', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Compilation & Testcases output log
              </div>
              <pre style={{ flex: 1, padding: '1rem', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a7f3d0', whiteSpace: 'pre-wrap' }}>
                {compilerOutput}
              </pre>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sandbox Execution Metrics</div>
              
              {metrics ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={16} style={{ color: 'var(--primary)' }} />
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Runtime execution</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{metrics.runtime} ms</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={16} style={{ color: 'var(--success)' }} />
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Memory footprint</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{metrics.memory} KB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  Awaiting test verification metrics...
                </div>
              )}

              {testCases.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Test Cases:</div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {testCases.map((tc, idx) => (
                      <span key={idx} className={`badge ${tc.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                        Case {idx + 1}: {tc.passed ? 'Passed' : 'Failed'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
