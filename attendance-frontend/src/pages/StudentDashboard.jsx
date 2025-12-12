import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => { try { const res = await api.get('/student/my-percentage'); setStats(res.data); } catch (e) { console.error(e); } };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!sessionCode.trim()) return;
    setLoading(true); setMessage(null);
    try {
      const res = await api.post('/student/mark-attendance', { code: sessionCode.toUpperCase() });
      setMessage({ type: 'success', text: `Marked present for ${res.data.subject}` });
      setSessionCode(''); setTimeout(fetchStats, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid Code' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 bg-app d-flex flex-column">
      <nav className="bg-white border-bottom px-4 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-bold text-heading">QuickMark</div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn btn-sm text-muted">Log Out</button>
        </div>
      </nav>

      <div className="container flex-grow-1 py-5 d-flex flex-column align-items-center">
         
         {/* Check-in Card */}
         <div className="card-pro p-5 mb-5 text-center shadow-lg-soft border-0" style={{maxWidth: '480px', width: '100%'}}>
            <h2 className="fw-bold text-heading mb-2">Check In</h2>
            <p className="text-muted small mb-4">Enter the code displayed on the screen</p>

            <form onSubmit={handleSubmitCode}>
               <input 
                 type="text" 
                 className="form-control text-center fw-bold text-mono mb-3" 
                 style={{fontSize: '2.5rem', height: '80px', letterSpacing: '0.5rem', borderColor: '#E2E8F0'}}
                 placeholder="------"
                 maxLength={6}
                 value={sessionCode}
                 onChange={e => setSessionCode(e.target.value.toUpperCase())}
               />
               <button disabled={loading} className="btn-pro-primary w-100 py-3 mb-3">
                  {loading ? 'Verifying...' : 'Submit Attendance'}
               </button>
            </form>

            {message && (
               <div className={`p-3 rounded-2 small fw-bold ${message.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                  {message.text}
               </div>
            )}
         </div>

         {/* Stats Overview */}
         <div className="w-100" style={{maxWidth: '800px'}}>
            <h6 className="text-uppercase text-muted fw-bold small mb-3 ps-1">Your Performance</h6>
            <div className="row g-3">
               {stats?.classes?.map(c => (
                  <div key={c.classId} className="col-md-6">
                     <div className="card-pro p-4 h-100 d-flex justify-content-between align-items-center">
                        <div>
                           <h6 className="fw-bold text-heading m-0">{c.subject}</h6>
                           <div className="small text-muted">{c.className}</div>
                        </div>
                        <div className="text-end">
                           <div className={`fs-4 fw-bold ${c.percentage < 75 ? 'text-danger' : 'text-success'}`}>{c.percentage}%</div>
                           <div className="small text-muted">{c.attendedSessions}/{c.totalSessions}</div>
                        </div>
                     </div>
                  </div>
               ))}
               {!stats && <p className="text-center text-muted col-12">Loading records...</p>}
            </div>
         </div>
      </div>
    </div>
  );
};
export default StudentDashboard;