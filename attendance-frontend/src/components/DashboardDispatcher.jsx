import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DashboardDispatcher - Routes users to their role-specific dashboard
 * This component checks the user's role and redirects accordingly
 */
const DashboardDispatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      // No user logged in, redirect to login
      navigate('/', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // Route based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'teacher':
          navigate('/teacher/dashboard', { replace: true });
          break;
        case 'student':
          navigate('/student/dashboard', { replace: true });
          break;
        default:
          // Unknown role, redirect to login
          navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardDispatcher;

