import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", { email, password });

            if (res.data.success) {
                const data = res.data.data;
                login({
                    userId: data.userId,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role
                });
                navigate("/");
            } else {
                setError(res.data.message);
            }
        } catch {
            setError("Login failed. Please try again.");
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-sidebar">
                <div style={{ position: "relative", zIndex: 10 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", border: "8px solid var(--primary)", borderTopColor: "var(--secondary)", marginBottom: 40 }} />
                    <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
                        Welcome back<br />to WeeklyReport
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: 300 }}>
                        Manage your team's progress and stay on top of your weekly tasks effortlessly.
                    </p>
                </div>
            </div>

            <div className="auth-form-area">
                <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--text-dark)" }}>Sign in to account</h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
                        Enter your email and password to log in
                    </p>

                    {error && (
                        <div style={{ background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: 12, fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                            <FiAlertCircle />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: 20 }}>
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input-modern"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <label className="input-label">Password</label>
                                <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
                            </div>
                            <input
                                type="password"
                                className="input-modern"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-modern btn-primary" style={{ width: "100%", padding: 16, fontSize: 15, justifyContent: "space-between" }}>
                            Sign In
                            <FiArrowRight size={18} />
                        </button>
                    </form>

                    <div style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
                        Don't have an account? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 700 }}>Register now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
