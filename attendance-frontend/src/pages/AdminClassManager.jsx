import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminClassManager = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Data State
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form & UI State
  const [newClass, setNewClass] = useState({ className: '', subject: '', teacherId: '' });
  const [selectedClass, setSelectedClass] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [c, t, s] = await Promise.all([api.get('/classes'), api.get('/users/role/teacher'), api.get('/users/role/student')]);
      setClasses(c.data); setTeachers(t.data); setStudents(s.data);
    } catch (e) { alert('Failed to load data'); } finally { setLoading(false); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.className || !newClass.teacherId) return;
    try {
      const res = await api.post('/classes', newClass);
      setClasses([res.data, ...classes]);
      setNewClass({ className: '', subject: '', teacherId: '' });
      alert('Class created successfully');
    } catch (e) { alert('Failed to create class'); }
  };

  const handleAddStudent = async () => {
     if(!selectedStudentId) return;
     try {
        const res = await api.put(`/classes/${selectedClass._id}/student`, { studentId: selectedStudentId, action: 'add' });
        setClasses(classes.map(c => c._id === selectedClass._id ? res.data : c));
        setSelectedClass(res.data);
        alert('Student Added');
     } catch (e) { alert('Error adding student'); }
  };

  if (loading) return <div className="min-vh-100 bg-app d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="min-vh-100 bg-app">
      <nav className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
         <div className="d-flex align-items-center gap-3">
            <button onClick={() => navigate('/admin/dashboard')} className="btn btn-sm btn-light">← Back</button>
            <span className="fw-bold text-heading">Class Manager</span>
         </div>
         <span className="text-muted small">{user?.name}</span>
      </nav>

      <div className="container py-5">
         <div className="row g-4">
            {/* Create Class Form */}
            <div className="col-lg-4">
               <div className="card-pro p-4 sticky-top" style={{top: '20px'}}>
                  <h5 className="fw-bold text-heading mb-3">Create New Class</h5>
                  <form onSubmit={handleCreateClass}>
                     <div className="mb-3">
                        <label className="small fw-bold text-muted mb-1">Class Name</label>
                        <input type="text" className="input-pro" placeholder="e.g. CS-101" value={newClass.className} onChange={e => setNewClass({...newClass, className: e.target.value})} required />
                     </div>
                     <div className="mb-3">
                        <label className="small fw-bold text-muted mb-1">Subject</label>
                        <input type="text" className="input-pro" placeholder="e.g. Algorithms" value={newClass.subject} onChange={e => setNewClass({...newClass, subject: e.target.value})} required />
                     </div>
                     <div className="mb-4">
                        <label className="small fw-bold text-muted mb-1">Assign Teacher</label>
                        <select className="input-pro form-select" value={newClass.teacherId} onChange={e => setNewClass({...newClass, teacherId: e.target.value})} required>
                           <option value="">-- Select Teacher --</option>
                           {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                     </div>
                     <button type="submit" className="btn-pro-primary w-100">Create Class</button>
                  </form>
               </div>
            </div>

            {/* Class List */}
            <div className="col-lg-8">
               <h5 className="fw-bold text-heading mb-3">All Classes ({classes.length})</h5>
               {classes.length === 0 ? <p className="text-muted">No classes found.</p> : (
                  <div className="d-flex flex-column gap-3">
                     {classes.map(cls => (
                        <div key={cls._id} className="card-pro p-4">
                           <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                 <h5 className="fw-bold text-heading m-0">{cls.className}</h5>
                                 <p className="text-muted small m-0">{cls.subject}</p>
                              </div>
                              <span className="badge-pro badge-warning text-dark bg-opacity-10">{cls.students?.length || 0} Students</span>
                           </div>
                           
                           <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                              <div className="d-flex align-items-center gap-2">
                                 <div className="bg-light rounded-circle p-1" style={{width: '32px', height: '32px', textAlign:'center'}}>👨‍🏫</div>
                                 <span className="small fw-bold text-muted">{cls.teacher?.name || 'Unassigned'}</span>
                              </div>
                              <button onClick={() => { setSelectedClass(cls); setShowStudentModal(true); }} className="btn btn-sm btn-pro-outline">
                                 Manage Students
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Student Management Modal Overlay */}
      {showStudentModal && selectedClass && (
         <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{zIndex: 1050}}>
            <div className="card-pro p-0 shadow-lg w-100" style={{maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden'}}>
               <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-subtle">
                  <h5 className="fw-bold m-0 text-heading">Manage: {selectedClass.className}</h5>
                  <button onClick={() => setShowStudentModal(false)} className="btn-close"></button>
               </div>
               
               <div className="p-4" style={{overflowY: 'auto', maxHeight: '60vh'}}>
                  {/* Add Student */}
                  <div className="d-flex gap-2 mb-4">
                     <select className="input-pro form-select" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                        <option value="">Select Student to Add...</option>
                        {students.filter(s => !selectedClass.students?.some(en => en._id === s._id)).map(s => (
                           <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
                        ))}
                     </select>
                     <button onClick={handleAddStudent} className="btn-pro-primary" style={{whiteSpace: 'nowrap'}}>Add</button>
                  </div>

                  {/* List */}
                  <h6 className="small fw-bold text-muted text-uppercase mb-3">Enrolled Students</h6>
                  <ul className="list-group list-group-flush border rounded-2">
                     {selectedClass.students?.map(s => (
                        <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center">
                           <div>
                              <div className="fw-bold text-dark">{s.name}</div>
                              <div className="small text-muted">{s.rollNumber}</div>
                           </div>
                        </li>
                     ))}
                     {(!selectedClass.students || selectedClass.students.length === 0) && <li className="list-group-item text-muted text-center py-3">No students enrolled</li>}
                  </ul>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
export default AdminClassManager;