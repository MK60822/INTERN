import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classReport, setClassReport] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchClasses(); }, []);
  useEffect(() => { if (selectedClassId) { handleFetchReport(); setGeneratedCode(''); } }, [selectedClassId]);

  const fetchClasses = async () => { try { const res = await api.get('/teacher/my-classes'); setClasses(res.data); } catch (e) { console.error(e); } };
  const handleGenerateCode = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    try { const res = await api.post('/teacher/generate-code', { classId: selectedClassId }); setGeneratedCode(res.data.code); } 
    catch (e) { alert('Error'); } finally { setLoading(false); }
  };
  const handleFetchReport = async () => { try { const res = await api.get(`/teacher/class-report/${selectedClassId}`); setClassReport(res.data); } catch (e) { console.error(e); } };

  return (
    <div className="min-vh-100 bg-app">
      {/* Pro Navbar */}
      <nav className="bg-white border-bottom px-4 py-3 sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
             <div className="fw-bold text-heading fs-5">QuickMark <span className="text-muted fw-normal">/ Teacher</span></div>
          </div>
          <div className="d-flex align-items-center gap-3">
             <div className="text-end d-none d-md-block line-height-sm">
                <div className="fw-bold small">{user?.name}</div>
                <div className="text-muted" style={{fontSize: '0.7rem'}}>Instructor</div>
             </div>
             <button onClick={() => { logout(); navigate('/'); }} className="btn btn-sm btn-outline-secondary rounded-2">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          {/* Sidebar / Controls */}
          <div className="col-lg-3">
             <div className="card-pro p-4 mb-4 sticky-top" style={{top: '100px'}}>
                <h6 className="fw-bold text-uppercase text-muted small mb-3">Classroom Controls</h6>
                
                <div className="mb-4">
                  <label className="small fw-bold mb-2">Select Active Class</label>
                  <select className="input-pro form-select" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                    <option value="">-- Select Class --</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                  </select>
                </div>

                <button onClick={handleGenerateCode} disabled={!selectedClassId || loading} className="btn-pro-primary w-100 mb-2">
                   {loading ? 'Generating...' : 'Start Live Session'}
                </button>
                <button onClick={() => navigate('/teacher/analytics')} className="btn-pro-outline w-100">View Analytics</button>

                {generatedCode && (
                  <div className="mt-4 p-4 bg-dark text-white rounded-3 text-center shadow-lg-soft">
                     <div className="text-uppercase small opacity-50 mb-1">Session Code</div>
                     <div className="display-4 fw-bold text-mono letter-spacing-2">{generatedCode}</div>
                     <div className="mt-3">
                        <button onClick={() => navigate('/teacher/qr-session', { state: { code: generatedCode, ...classReport } })} className="btn btn-sm btn-light w-100 fw-bold">
                           Launch Projector View ↗
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>

          {/* Main Data Area */}
          <div className="col-lg-9">
             <div className="card-pro h-100">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                   <h5 className="fw-bold m-0 text-heading">Attendance Report</h5>
                   {classReport && <span className="badge-pro badge-success">{classReport.students.length} Students</span>}
                </div>
                
                <div className="p-0">
                  {!selectedClassId ? (
                    <div className="text-center py-5 text-muted">
                       <p className="mb-0">Select a class from the sidebar to view data.</p>
                    </div>
                  ) : !classReport ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                  ) : (
                    <div className="table-responsive">
                       <table className="table table-hover mb-0 align-middle">
                          <thead className="bg-subtle text-muted small text-uppercase">
                             <tr>
                                <th className="ps-4 py-3 border-0">Student Name</th>
                                <th className="py-3 border-0">Contact</th>
                                <th className="py-3 border-0 text-center">Attendance %</th>
                                <th className="pe-4 py-3 border-0 text-end">Status</th>
                             </tr>
                          </thead>
                          <tbody>
                             {classReport.students.map(s => (
                                <tr key={s._id}>
                                   <td className="ps-4">
                                      <div className="fw-bold text-dark">{s.name}</div>
                                      <div className="small text-muted text-mono">{s.rollNumber}</div>
                                   </td>
                                   <td><div className="small text-muted">{s.email}</div></td>
                                   <td className="text-center">
                                      <span className="fw-bold">{s.percentage}%</span>
                                   </td>
                                   <td className="pe-4 text-end">
                                      {s.percentage >= 75 
                                        ? <span className="badge-pro badge-success">Good</span> 
                                        : <span className="badge-pro badge-danger">At Risk</span>
                                      }
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherDashboard;