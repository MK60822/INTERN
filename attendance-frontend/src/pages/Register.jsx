import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", confirmPassword: "", role: "student", department: "", rollNumber: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
        
        setLoading(true);
        try {
            await api.post('/auth/register', { 
                ...formData, 
                rollNumber: formData.role === 'student' ? formData.rollNumber : null 
            });
            setSuccess("Account created successfully. Redirecting...");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-vh-100 bg-app d-flex align-items-center justify-content-center p-4">
            <div className="card-pro p-5 w-100" style={{ maxWidth: "600px" }}>
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-heading">Create Account</h2>
                    <p className="text-muted">Join the QuickMark academic network.</p>
                </div>

                {error && <div className="alert alert-danger py-2 small border-danger bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}
                {success && <div className="alert alert-success py-2 small border-success bg-success bg-opacity-10 text-success mb-4">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Role Selector Tabs */}
                    <div className="d-flex p-1 bg-subtle rounded-3 mb-4">
                        {['student', 'teacher'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setFormData({...formData, role: r})}
                                className={`flex-fill btn btn-sm fw-bold text-capitalize rounded-2 py-2 ${formData.role === r ? 'bg-white shadow-sm text-dark' : 'text-muted border-0'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Full Name</label>
                            <input type="text" name="name" className="input-pro" placeholder="John Doe" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Email Address</label>
                            <input type="email" name="email" className="input-pro" placeholder="name@school.edu" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {formData.role === 'student' && (
                        <div className="mb-3">
                            <label className="small fw-bold text-muted mb-1">Roll Number</label>
                            <input type="text" name="rollNumber" className="input-pro text-mono" placeholder="CS-2024-001" onChange={handleChange} required />
                        </div>
                    )}
                    {formData.role === 'teacher' && (
                        <div className="mb-3">
                            <label className="small fw-bold text-muted mb-1">Department</label>
                            <input type="text" name="department" className="input-pro" placeholder="Computer Science" onChange={handleChange} />
                        </div>
                    )}

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Password</label>
                            <input type="password" name="password" className="input-pro" placeholder="Min 6 characters" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" className="input-pro" placeholder="Re-enter password" onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn-pro-primary w-100 py-3" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Complete Registration'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted small">Already have an account? </span>
                    <button onClick={() => navigate("/")} className="btn btn-link p-0 fw-bold text-dark text-decoration-none small">Sign In</button>
                </div>
            </div>
        </div>
    );
};
export default Register;