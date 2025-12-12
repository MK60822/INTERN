import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="vh-100 d-flex flex-column" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* 1. Minimal Navbar */}
      <nav className="navbar navbar-light bg-white px-4 py-3 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Brand Logo */}
          <span className="fw-bold fs-4">QuickMark</span>

          {/* Navigation Links */}
          <div className="d-flex align-items-center gap-4">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
              className="text-dark text-decoration-none fw-bold small"
            >
              Dashboard
            </a>

            {/* Show Admin Panel link if user is admin */}
            {user?.role === 'admin' && (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate('/admin/classes'); }}
                className="text-dark text-decoration-none fw-bold small"
              >
                Admin Panel
              </a>
            )}

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
              className="text-dark text-decoration-none fw-bold small"
            >
              Profile
            </a>

            <span className="text-muted small">
              {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-dark rounded-pill px-3"
              style={{ fontSize: "0.85rem" }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section with Background Text */}
      <div
        className="flex-grow-1 d-flex align-items-center justify-content-center position-relative"
        style={{
          background: "linear-gradient(180deg, #f5f5f5 0%, #e5e5e5 100%)",
          overflow: "hidden"
        }}
      >

        {/* Background Text Effect */}
        <div className="position-absolute text-center w-100" style={{ zIndex: 0, opacity: 0.1, top: "30%" }}>
          <h1 className="fw-black text-uppercase fst-italic" style={{ fontSize: "8rem", fontWeight: "900", lineHeight: "0.9" }}>
            MAKE IT<br/>COUNT
          </h1>
        </div>

        {/* 3. Action Cards Container */}
        <div className="container" style={{ zIndex: 10, maxWidth: "1200px" }}>

          {/* Welcome Message */}
          <div className="text-center mb-5">
            <h2 className="fw-bold text-uppercase mb-2" style={{ letterSpacing: "2px" }}>
              Ready to Teach
            </h2>
            <p className="text-muted">Choose your action below</p>
          </div>

          {/* Action Buttons Grid */}
          <div className="row g-4 justify-content-center">

            {/* Action 1: Start Session */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-lg p-4 text-center h-100 hover-lift"
                style={{
                  borderRadius: "0px",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onClick={() => navigate('/qr-session')}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="mb-3" style={{ fontSize: "3rem" }}>📱</div>
                <h4 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: "1px" }}>
                  Start Session
                </h4>
                <p className="text-muted mb-4">
                  Generate QR code for real-time attendance tracking
                </p>
                <button
                  className="btn btn-dark w-100 py-3 rounded-pill fw-bold text-uppercase"
                  style={{ letterSpacing: "1px" }}
                >
                  Launch QR
                </button>
              </div>
            </div>

            {/* Action 2: Analytics */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-lg p-4 text-center h-100 hover-lift"
                style={{
                  borderRadius: "0px",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onClick={() => navigate('/analytics')}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="mb-3" style={{ fontSize: "3rem" }}>📊</div>
                <h4 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: "1px" }}>
                  Analytics
                </h4>
                <p className="text-muted mb-4">
                  View detailed monthly attendance reports
                </p>
                <button
                  className="btn btn-outline-dark w-100 py-3 rounded-pill fw-bold text-uppercase"
                  style={{ letterSpacing: "1px" }}
                >
                  View Reports
                </button>
              </div>
            </div>

            {/* Action 3: Settings */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-lg p-4 text-center h-100 hover-lift"
                style={{
                  borderRadius: "0px",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onClick={() => navigate('/settings')}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="mb-3" style={{ fontSize: "3rem" }}>⚙️</div>
                <h4 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: "1px" }}>
                  Settings
                </h4>
                <p className="text-muted mb-4">
                  Manage your profile and class configurations
                </p>
                <button
                  className="btn btn-outline-dark w-100 py-3 rounded-pill fw-bold text-uppercase"
                  style={{ letterSpacing: "1px" }}
                >
                  Configure
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Footer Message */}
      <div className="bg-light py-2 text-center">
        <small className="text-muted fw-bold">Empowering Education Through Technology</small>
      </div>
    </div>
  );
};

export default Dashboard;

