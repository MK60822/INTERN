import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ teachers: 0, students: 0, classes: 0 });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, s, c] = await Promise.all([api.get('/admin/teachers'), api.get('/admin/students'), api.get('/classes')]);
        setStats({ teachers: t.data.length, students: s.data.length, classes: c.data.length });
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-vh-100 bg-app">
      <nav className="bg-dark text-white px-4 py-3 shadow-sm d-flex justify-content-between align-items-center">
        <span className="fw-bold fs-5 text-heading">Admin Console</span>
        <div className="d-flex align-items-center gap-3">
          <small className="opacity-75">{user?.name}</small>
          <button onClick={() => { logout(); navigate('/'); }} className="btn btn-sm btn-outline-light">Logout</button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h2 className="fw-bold text-heading m-0">Dashboard</h2>
                <p className="text-muted m-0">System Overview & Statistics</p>
            </div>
            <button onClick={() => window.location.reload()} className="btn btn-sm btn-pro-outline">Refresh Data</button>
        </div>
        
        {/* Stats Grid */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card-pro p-4 h-100 d-flex justify-content-between align-items-center">
               <div>
                  <div className="text-muted small text-uppercase fw-bold mb-1">Total Students</div>
                  <div className="display-5 fw-bold text-heading">{stats.students}</div>
               </div>
               <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary fs-4">🎓</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-pro p-4 h-100 d-flex justify-content-between align-items-center">
               <div>
                  <div className="text-muted small text-uppercase fw-bold mb-1">Active Teachers</div>
                  <div className="display-5 fw-bold text-heading">{stats.teachers}</div>
               </div>
               <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success fs-4">👨‍🏫</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-pro p-4 h-100 d-flex justify-content-between align-items-center">
               <div>
                  <div className="text-muted small text-uppercase fw-bold mb-1">Classes Created</div>
                  <div className="display-5 fw-bold text-heading">{stats.classes}</div>
               </div>
               <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning fs-4">📚</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h5 className="fw-bold text-heading mb-3">Management Tools</h5>
        <div className="row g-4">
            <div className="col-md-6">
                <div onClick={() => navigate('/admin/classes')} className="card-pro p-4 cursor-pointer h-100 d-flex align-items-start gap-3">
                    <div className="fs-2">📋</div>
                    <div>
                        <h5 className="fw-bold text-heading mb-1">Class Manager</h5>
                        <p className="text-muted small m-0">Create new classes, assign teachers, and manage student enrollments.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div onClick={() => navigate('/register')} className="card-pro p-4 cursor-pointer h-100 d-flex align-items-start gap-3">
                    <div className="fs-2">➕</div>
                    <div>
                        <h5 className="fw-bold text-heading mb-1">User Registration</h5>
                        <p className="text-muted small m-0">Manually register new students or teachers into the system.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;