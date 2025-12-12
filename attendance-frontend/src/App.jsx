import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QRSession from './pages/QRSession';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AdminClassManager from './pages/AdminClassManager';
import TeacherRoute from './components/TeacherRoute';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';
import DashboardDispatcher from './components/DashboardDispatcher';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Dispatcher - Routes to role-specific dashboard */}
          <Route path="/dashboard" element={<DashboardDispatcher />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <AdminRoute>
                <AdminClassManager />
              </AdminRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            }
          />
          <Route
            path="/teacher/qr-session"
            element={
              <TeacherRoute>
                <QRSession />
              </TeacherRoute>
            }
          />
          <Route
            path="/teacher/analytics"
            element={
              <TeacherRoute>
                <Analytics />
              </TeacherRoute>
            }
          />
          <Route
            path="/teacher/settings"
            element={
              <TeacherRoute>
                <Settings />
              </TeacherRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
