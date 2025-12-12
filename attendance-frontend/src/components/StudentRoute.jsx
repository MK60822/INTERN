import { Navigate } from 'react-router-dom';

/**
 * StudentRoute - Role-Based Access Control (RBAC) wrapper component
 * Protects routes that should only be accessible to students
 */
const StudentRoute = ({ children }) => {
  // Retrieve user object from localStorage
  const storedUser = localStorage.getItem('user');
  
  // Condition 1: If no user is logged in, redirect to Login
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    
    // Condition 2: If user is not a student, show access denied
    if (user.role !== 'student') {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="card shadow-lg p-5 text-center" style={{ maxWidth: "500px" }}>
            <div className="display-1 mb-4">🚫</div>
            <h2 className="fw-bold mb-3">Access Denied</h2>
            <p className="text-muted mb-4">
              This area is restricted to students only.
            </p>
            <a href="/dashboard" className="btn btn-primary rounded-pill px-4">
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }

    // Condition 3: User is a student, render the protected component
    return children;

  } catch (error) {
    // If parsing fails, redirect to login
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default StudentRoute;

