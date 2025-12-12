import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-app">
      <nav className="bg-white border-bottom px-4 py-3">
         <div className="d-flex align-items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-sm btn-light">← Back</button>
            <span className="fw-bold text-heading">Analytics</span>
         </div>
      </nav>

      <div className="container py-5 text-center">
         <div className="card-pro p-5 d-inline-block text-center" style={{maxWidth: '500px'}}>
            <div className="fs-1 mb-3">📊</div>
            <h3 className="fw-bold text-heading">Detailed Reports</h3>
            <p className="text-muted">Advanced analytics and historical data visualization will be available in the next update.</p>
            <button onClick={() => navigate('/teacher/dashboard')} className="btn-pro-primary mt-3">Return to Dashboard</button>
         </div>
      </div>
    </div>
  );
};
export default Analytics;