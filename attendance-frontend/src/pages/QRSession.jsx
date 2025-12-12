import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const QRSession = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { code = '----', className = 'Class', subject = 'Subject' } = location.state || {};

  return (
    <div className="vh-100 bg-dark text-white d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-4">
         <button onClick={() => navigate('/teacher/dashboard')} className="btn btn-outline-light btn-sm rounded-2">← Back to Dashboard</button>
         <div className="text-white-50">{className} / {subject}</div>
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
         <div className="text-center">
            <p className="text-uppercase text-white-50 letter-spacing-2 fw-bold mb-4">Attendance Code</p>
            <div className="bg-white text-dark rounded-4 p-5 mb-5 shadow-lg d-inline-block">
               <h1 className="fw-bold text-mono m-0" style={{fontSize: '8rem', letterSpacing: '1rem', lineHeight: 1}}>{code}</h1>
            </div>
            
            <div className="row justify-content-center g-5 opacity-75 mt-2">
               <div className="col-auto text-center">
                  <div className="h4 mb-1">1. Login</div>
                  <div className="small text-white-50">Student Portal</div>
               </div>
               <div className="col-auto text-center">
                  <div className="h4 mb-1">2. Enter Code</div>
                  <div className="small text-white-50">6-Digit PIN</div>
               </div>
               <div className="col-auto text-center">
                  <div className="h4 mb-1">3. Done</div>
                  <div className="small text-white-50">Recorded Instantly</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default QRSession;