import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiArrowUp, FiArrowDown, FiChevronRight, FiFilter, FiActivity } from "react-icons/fi";

const PIE_COLORS = ["#4fc3f7", "#ff6b81", "#ffd32a", "#a4b0be"];

export default function Dashboard() {
    const [dashboard, setDashboard] = useState({});
    const [reports, setReports] = useState([]);
    const [filterProject, setFilterProject] = useState("");
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [filterUser, setFilterUser] = useState("");
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");

    useEffect(() => {
        api.get("/dashboard").then(res => setDashboard(res.data));
        api.get("/reports").then(res => setReports(res.data));
        api.get("/projects").then(res => setProjects(res.data));
        api.get("/users").then(res => setUsers(res.data.filter(u => u.role === "MEMBER")));
    }, []);

    const pieData = [
        { name: "Submitted", value: Number(dashboard.submittedReports) || 0 },
        { name: "Approved", value: Number(dashboard.approvedReports) || 0 },
        { name: "Rejected", value: Number(dashboard.rejectedReports) || 0 },
        { name: "Draft", value: Number(dashboard.draftReports) || 0 }
    ].filter(d => d.value > 0);

    const userReportCounts = {};
    reports.forEach(r => {
        if (r.user) {
            const name = r.user.firstName;
            userReportCounts[name] = (userReportCounts[name] || 0) + 1;
        }
    });
    const barData = Object.entries(userReportCounts).map(([name, count]) => ({ name, count }));

    const filteredReports = reports.filter(r => {
        if (filterProject && r.project && r.project.id !== Number(filterProject)) return false;
        if (filterProject && !r.project) return false;
        if (filterUser && r.user && r.user.id !== Number(filterUser)) return false;
        if (filterUser && !r.user) return false;
        if (filterStart && r.weekStart && r.weekStart < filterStart) return false;
        if (filterEnd && r.weekEnd && r.weekEnd > filterEnd) return false;
        return true;
    });

    function approveReport(id) {
        api.put("/reports/" + id + "/approve").then(() => reload());
    }

    function rejectReport(id) {
        api.put("/reports/" + id + "/reject").then(() => reload());
    }

    function reload() {
        api.get("/reports").then(res => setReports(res.data));
        api.get("/dashboard").then(res => setDashboard(res.data));
    }

    return (
        <MainLayout>
            <div className="grid-3-col" style={{ marginBottom: 24 }}>
                {/* Bar Chart 1 */}
                <div className="ui-card">
                    <div className="ui-card-title" style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                        <span>Report Submissions</span>
                        <span style={{ fontWeight: 800 }}>:</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "24px" }}>
                        <span style={{ fontWeight: 800, color: "var(--text-dark)", fontSize: 16 }}>{dashboard.totalReports || 0}</span> Total this week
                    </div>
                    <div style={{ height: 160, display: "flex", flexDirection: "column" }}>
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }} />
                                    <Bar dataKey="count" fill="var(--primary)" radius={[10, 10, 10, 10]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13, background: "var(--bg-input)", borderRadius: 12 }}>
                                No data available
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12, color: "#b2bec3", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                        {barData.map(d => <span key={d.name}>{d.name.substring(0,3)}</span>)}
                    </div>
                </div>

                {/* Bar Chart 2 */}
                <div className="ui-card">
                    <div className="ui-card-title" style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                        <span>Status Overview</span>
                        <span style={{ fontWeight: 800 }}>:</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "24px" }}>
                        <span style={{ fontWeight: 800, color: "var(--text-dark)", fontSize: 16 }}>{dashboard.approvedReports || 0}</span> Approved
                    </div>
                    <div style={{ height: 160, display: "flex", flexDirection: "column" }}>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pieData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }} />
                                    <Bar dataKey="value" fill="var(--secondary)" radius={[10, 10, 10, 10]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13, background: "var(--bg-input)", borderRadius: 12 }}>
                                No data available
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12, color: "#b2bec3", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                        {pieData.map(d => <span key={d.name}>{d.name.substring(0,3)}</span>)}
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="ui-card" style={{ flex: 1, padding: "20px" }}>
                        <h3 className="ui-card-title" style={{ fontSize: 15, marginBottom: 16 }}>System Stats</h3>
                        
                        <div style={{ background: "var(--bg-input)", padding: "12px 16px", borderRadius: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--secondary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <FiActivity size={14} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Total Projects</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-dark)" }}>{dashboard.totalProjects || 0}</div>
                            </div>
                        </div>

                        <div style={{ background: "var(--bg-input)", padding: "12px 16px", borderRadius: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--text-dark)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <FiActivity size={14} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Active Users</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-dark)" }}>{dashboard.totalUsers || 0}</div>
                            </div>
                        </div>

                        <div style={{ background: "var(--bg-input)", padding: "12px 16px", borderRadius: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ff7b93", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <FiActivity size={14} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Open Blockers</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-dark)" }}>{dashboard.openBlockersCount || 0}</div>
                            </div>
                        </div>

                        <div style={{ background: "var(--bg-input)", padding: "12px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ffd32a", color: "var(--text-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <FiActivity size={14} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Compliance Rate</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-dark)" }}>{dashboard.submissionComplianceRate || 0}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2-col" style={{ marginBottom: 24 }}>
                {/* Banner Area */}
                <div style={{ 
                    background: "var(--accent)", 
                    borderRadius: "var(--radius-card)", 
                    padding: "40px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{ position: "relative", zIndex: 2, maxWidth: "60%" }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px", color: "var(--text-dark)" }}>
                            Generate Weekly Reports easily
                        </h2>
                        <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, fontWeight: 600 }}>
                            Use the filtering tools to generate structured reviews of your team's weekly progress.
                        </p>
                    </div>
                    
                    <button style={{ 
                        width: 44, height: 44, borderRadius: "50%", background: "#fff", 
                        border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", zIndex: 2, boxShadow: "var(--shadow-card)", flexShrink: 0, color: "var(--text-dark)"
                    }}>
                        <FiChevronRight size={20} />
                    </button>

                    <div style={{ position: "absolute", right: "-10%", top: "-20%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                    <div style={{ position: "absolute", right: "20%", bottom: "-30%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                </div>

                {/* Pie Chart */}
                <div className="ui-card">
                    <h3 className="ui-card-title" style={{ marginBottom: 0 }}>Reports by Status</h3>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flex: 1, padding: "20px 0" }}>
                        <div style={{ width: 120, height: 120, position: "relative", flexShrink: 0 }}>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={55} stroke="none">
                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: "100%", borderRadius: "50%", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }} />
                            )}
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "var(--text-dark)" }}>
                                {dashboard.totalReports > 0 ? "100%" : "0%"}
                            </div>
                        </div>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                            {pieData.map((d, i) => {
                                const percentage = dashboard.totalReports ? Math.round((d.value / dashboard.totalReports) * 100) : 0;
                                return (
                                    <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                                            <span style={{ color: "var(--text-dark)" }}>{d.name}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ color: "var(--text-muted)" }}>{percentage}%</span>
                                            <FiChevronRight size={12} color="#b2bec3" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom area */}
            <div className="ui-card">
                <div className="ui-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 20px 0", flexWrap: "wrap", gap: 16 }}>
                    <span>Recent Reports</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        {/* Project Filter */}
                        <div className="search-bar" style={{ background: "transparent", border: "1px solid var(--border)", width: "auto", padding: "6px 12px", height: 36 }}>
                            <FiFilter color="var(--text-muted)" size={12} />
                            <select 
                                style={{ border: "none", outline: "none", fontSize: 11, color: "var(--text-dark)", background: "transparent", fontWeight: 600 }}
                                value={filterProject}
                                onChange={e => setFilterProject(e.target.value)}
                            >
                                <option value="">All Projects</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {/* Team Member Filter */}
                        <div className="search-bar" style={{ background: "transparent", border: "1px solid var(--border)", width: "auto", padding: "6px 12px", height: 36 }}>
                            <FiFilter color="var(--text-muted)" size={12} />
                            <select 
                                style={{ border: "none", outline: "none", fontSize: 11, color: "var(--text-dark)", background: "transparent", fontWeight: 600 }}
                                value={filterUser}
                                onChange={e => setFilterUser(e.target.value)}
                            >
                                <option value="">All Members</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                            </select>
                        </div>
                        {/* Date Start Filter */}
                        <div className="search-bar" style={{ background: "transparent", border: "1px solid var(--border)", width: "auto", padding: "6px 12px", height: 36 }}>
                            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginRight: 4 }}>From:</span>
                            <input 
                                type="date"
                                style={{ border: "none", outline: "none", fontSize: 11, color: "var(--text-dark)", background: "transparent", fontWeight: 600, padding: 0 }}
                                value={filterStart}
                                onChange={e => setFilterStart(e.target.value)}
                            />
                        </div>
                        {/* Date End Filter */}
                        <div className="search-bar" style={{ background: "transparent", border: "1px solid var(--border)", width: "auto", padding: "6px 12px", height: 36 }}>
                            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginRight: 4 }}>To:</span>
                            <input 
                                type="date"
                                style={{ border: "none", outline: "none", fontSize: 11, color: "var(--text-dark)", background: "transparent", fontWeight: 600, padding: 0 }}
                                value={filterEnd}
                                onChange={e => setFilterEnd(e.target.value)}
                            />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--secondary)", cursor: "pointer", marginLeft: 4 }} onClick={() => {
                            setFilterProject("");
                            setFilterUser("");
                            setFilterStart("");
                            setFilterEnd("");
                        }}>Reset</span>
                    </div>
                </div>

                <div style={{ overflowX: "auto", marginTop: 20 }}>
                    <table className="table-ui">
                        <tbody>
                            {filteredReports.slice(0, 5).map(r => (
                                <tr key={r.id}>
                                    <td style={{ width: 60 }}>
                                        <div style={{ 
                                            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                                            background: r.status === "APPROVED" ? "var(--primary-light)" : r.status === "REJECTED" ? "#ffebee" : "var(--bg-input)", 
                                            color: r.status === "APPROVED" ? "var(--primary)" : r.status === "REJECTED" ? "var(--secondary)" : "var(--text-muted)",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, position: "relative"
                                        }}>
                                            {r.user?.firstName?.charAt(0)}{r.user?.lastName?.charAt(0)}
                                            <div style={{ position: "absolute", bottom: -2, right: -2, background: "#fff", borderRadius: "50%", padding: 2 }}>
                                                {r.status === "APPROVED" ? <FiArrowUp size={10} color="var(--primary)" /> : r.status === "REJECTED" ? <FiArrowDown size={10} color="var(--secondary)" /> : <FiActivity size={10} color="var(--text-muted)" />}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: "var(--text-dark)", marginBottom: 4 }}>
                                            {r.user?.firstName} {r.user?.lastName}
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                                            {r.project?.name || "No Project"}
                                        </div>
                                    </td>
                                    <td style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}>
                                        {r.weekStart} to {r.weekEnd}
                                    </td>
                                    <td style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}>
                                        ID: {r.id}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <span style={{ 
                                            fontWeight: 800, fontSize: 12,
                                            color: r.status === "APPROVED" ? "#10ac84" : r.status === "REJECTED" ? "var(--text-dark)" : "var(--text-muted)"
                                        }}>
                                            {r.status === "APPROVED" ? "+" : r.status === "REJECTED" ? "-" : ""} {r.status}
                                        </span>
                                    </td>
                                    <td style={{ width: 100, textAlign: "right", paddingRight: 0 }}>
                                        {r.status === "SUBMITTED" && (
                                            <button className="btn-modern btn-light" style={{ padding: "6px 12px", fontSize: 11 }} onClick={() => approveReport(r.id)}>
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredReports.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: 40, fontSize: 13, fontWeight: 500 }}>
                                        No reports match the current filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}