import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-app">
      <nav className="bg-white border-bottom px-4 py-3">
         <div className="d-flex align-items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-sm btn-light">← Back</button>
            <span className="fw-bold text-heading">Profile Settings</span>
         </div>
      </nav>

      <div className="container py-5 d-flex justify-content-center">
         <div className="card-pro p-5 w-100" style={{maxWidth: '600px'}}>
            <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom">
               <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fs-2 fw-bold" style={{width: '80px', height: '80px'}}>
                  {user?.name?.charAt(0)}
               </div>
               <div>
                  <h3 className="fw-bold text-heading m-0">{user?.name}</h3>
                  <p className="text-muted m-0 text-capitalize">{user?.role} Account</p>
               </div>
            </div>

            <form>
               <div className="mb-4">
                  <label className="small fw-bold text-muted mb-1 text-uppercase">Email Address</label>
                  <input type="text" className="input-pro bg-subtle text-muted" value={user?.email || ''} readOnly />
               </div>

               {user?.role === 'student' && (
                  <div className="mb-4">
                     <label className="small fw-bold text-muted mb-1 text-uppercase">Roll Number</label>
                     <input type="text" className="input-pro bg-subtle text-muted text-mono" value={user?.rollNumber || ''} readOnly />
                  </div>
               )}

               {user?.role === 'teacher' && (
                  <div className="mb-4">
                     <label className="small fw-bold text-muted mb-1 text-uppercase">Department</label>
                     <input type="text" className="input-pro bg-subtle text-muted" value={user?.department || ''} readOnly />
                  </div>
               )}

               <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary small">
                  <strong>Note:</strong> To update your profile details, please contact the system administrator.
               </div>

               <div className="mt-4 pt-3 border-top">
                  <button type="button" onClick={() => { logout(); navigate('/'); }} className="btn btn-outline-danger w-100 py-2 fw-bold">
                     Sign Out
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
};
export default Settings;