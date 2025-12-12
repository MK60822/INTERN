import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError("");
        const result = await login(email, password, role);
        if (result.success) {
            navigate(role === 'admin' ? "/admin/dashboard" : role === 'teacher' ? "/teacher/dashboard" : "/student/dashboard");
        } else { setError(result.message); }
        setLoading(false);
    };

    return (
        <div className="min-vh-100 d-flex flex-wrap">
            {/* Left Panel: Form */}
            <div className="col-lg-5 col-12 d-flex align-items-center justify-content-center bg-white p-5">
                <div style={{ maxWidth: "400px", width: "100%" }}>
                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="bg-dark rounded-circle" style={{width: '24px', height: '24px'}}></div>
                            <h4 className="fw-bold m-0 text-heading">QuickMark</h4>
                        </div>
                        <h1 className="fw-bold display-6 mb-2 text-heading">Welcome back</h1>
                        <p className="text-muted">Please enter your details to sign in.</p>
                    </div>

                    <div className="d-flex p-1 bg-subtle rounded-3 mb-4">
                        {['student', 'teacher', 'admin'].map(r => (
                            <button key={r} onClick={() => setRole(r)}
                                className={`flex-fill btn btn-sm fw-bold text-capitalize rounded-2 py-2 ${role === r ? 'bg-white shadow-sm text-dark' : 'text-muted border-0'}`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    {error && <div className="alert alert-danger py-2 small border-danger bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="small fw-bold text-muted mb-1">Email</label>
                            <input type="email" className="input-pro" placeholder="name@school.edu" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="small fw-bold text-muted mb-1">Password</label>
                            <input type="password" className="input-pro" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-pro-primary w-100 py-3" disabled={loading}>
                            {loading ? 'Processing...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-muted small">Don't have an account? </span>
                        <a href="/register" className="fw-bold text-dark text-decoration-none small">Register now</a>
                    </div>
                </div>
            </div>

            {/* Right Panel: Visual */}
            <div className="col-lg-7 d-none d-lg-flex bg-subtle align-items-center justify-content-center position-relative overflow-hidden">
                <div className="position-absolute" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(248,250,252,0) 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                <div className="text-center position-relative z-1 p-5">
                    <h2 className="display-4 fw-bold text-heading mb-3" style={{letterSpacing: '-1px'}}>Effortless Attendance.</h2>
                    <p className="lead text-muted" style={{maxWidth: '500px', margin: '0 auto'}}>Streamline your classroom management with our professional digital tracking solution.</p>
                </div>
            </div>
        </div>
    );
};
export default Login;