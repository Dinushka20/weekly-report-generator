import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "MEMBER"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await api.post("/auth/register", form);

            if (res.data.success) {
                setSuccess("Account created! Redirecting...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(res.data.message);
            }
        } catch {
            setError("Registration failed. Please try again.");
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-sidebar" style={{ background: "var(--primary)" }}>
                {/* Overriding background to primary for variety on register page */}
                <div style={{ position: "relative", zIndex: 10 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", border: "8px solid #fff", borderTopColor: "var(--accent)", marginBottom: 40 }} />
                    <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.2, color: "#fff" }}>
                        Join the<br />Platform
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, maxWidth: 300, fontWeight: 500 }}>
                        Create an account to start tracking your weekly progress and projects.
                    </p>
                </div>
            </div>

            <div className="auth-form-area">
                <div style={{ maxWidth: 380, margin: "0 auto", width: "100%" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--text-dark)" }}>Create an account</h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
                        Fill in your details below to get started
                    </p>

                    {error && (
                        <div style={{ background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: 12, fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                            <FiAlertCircle />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "12px 16px", borderRadius: 12, fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                            <FiCheckCircle />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
                            <div>
                                <label className="input-label">First Name</label>
                                <input
                                    type="text"
                                    className="input-modern"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div>
                                <label className="input-label">Last Name</label>
                                <input
                                    type="text"
                                    className="input-modern"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input-modern"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@company.com"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input-modern"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label className="input-label">Role</label>
                            <select
                                className="input-modern"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="MEMBER">Team Member</option>
                                <option value="MANAGER">Manager</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-modern btn-primary" style={{ width: "100%", padding: 16, fontSize: 15, justifyContent: "space-between" }}>
                            Create Account
                            <FiArrowRight size={18} />
                        </button>
                    </form>

                    <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
                        Already have an account? <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 700 }}>Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
