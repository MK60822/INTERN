import { Navigate } from 'react-router-dom';

/**
 * AdminRoute - Role-Based Access Control (RBAC) wrapper component
 * Protects routes that should only be accessible to admins
 */
const AdminRoute = ({ children }) => {
  // Retrieve user object from localStorage
  const storedUser = localStorage.getItem('user');
  
  // Condition 1: If no user is logged in, redirect to Login
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    
    // Condition 2: If user exists but role is NOT "admin", deny access
    if (user.role !== 'admin') {
      alert('Access Denied: This portal is for administrators only.');
      // Clear localStorage to force re-login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/" replace />;
    }

    // Condition 3: If user is an admin, render children components
    return children;
    
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Clear invalid data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;

