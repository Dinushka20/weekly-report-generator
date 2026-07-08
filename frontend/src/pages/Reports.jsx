import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiSend, FiX } from "react-icons/fi";

export default function Reports() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        weekStart: "",
        weekEnd: "",
        projectId: "",
        completedTasks: "",
        plannedTasks: "",
        blockers: "",
        hoursWorked: "",
        notes: ""
    });

    useEffect(() => {
        loadReports();
        loadProjects();
    }, []);

    function loadReports() {
        api.get("/reports/user/" + user.userId).then(res => setReports(res.data));
    }
    function loadProjects() {
        api.get("/projects").then(res => setProjects(res.data));
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function resetForm() {
        setForm({ weekStart: "", weekEnd: "", projectId: "", completedTasks: "", plannedTasks: "", blockers: "", hoursWorked: "", notes: "" });
        setEditingId(null);
        setShowForm(false);
    }

    function submitReport(status) {
        const payload = {
            ...form,
            userId: user.userId,
            projectId: form.projectId ? Number(form.projectId) : null,
            hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : null,
            status: status
        };

        if (editingId) {
            api.put("/reports/" + editingId, payload).then(() => { resetForm(); loadReports(); });
        } else {
            api.post("/reports", payload).then(() => { resetForm(); loadReports(); });
        }
    }

    function editReport(report) {
        setEditingId(report.id);
        setForm({
            weekStart: report.weekStart || "", weekEnd: report.weekEnd || "",
            projectId: report.project ? report.project.id : "",
            completedTasks: report.completedTasks || "", plannedTasks: report.plannedTasks || "",
            blockers: report.blockers || "", hoursWorked: report.hoursWorked || "", notes: report.notes || ""
        });
        setShowForm(true);
    }

    function deleteReport(id) {
        if (confirm("Are you sure you want to delete this report?")) {
            api.delete("/reports/" + id).then(() => loadReports());
        }
    }

    return (
        <MainLayout>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                {!showForm && (
                    <button className="btn-modern btn-primary" onClick={() => setShowForm(true)}>
                        <FiPlus size={16} /> New Report
                    </button>
                )}
            </div>

            {showForm && (
                <div className="ui-card" style={{ marginBottom: 24 }}>
                    <h3 className="ui-card-title">
                        {editingId ? "Edit Report" : "Create New Report"}
                        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }} onClick={resetForm}>
                            <FiX size={20} />
                        </button>
                    </h3>
                    
                    <div className="grid-3-col" style={{ marginBottom: 16 }}>
                        <div>
                            <label className="input-label">Week Start</label>
                            <input type="date" className="input-modern" name="weekStart" value={form.weekStart} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Week End</label>
                            <input type="date" className="input-modern" name="weekEnd" value={form.weekEnd} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Project</label>
                            <select className="input-modern" name="projectId" value={form.projectId} onChange={handleChange}>
                                <option value="">Select Project</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label className="input-label">Tasks Completed</label>
                        <textarea className="input-modern" name="completedTasks" rows="2" value={form.completedTasks} onChange={handleChange} />
                    </div>

                    <div className="grid-2-col" style={{ marginBottom: 16 }}>
                        <div>
                            <label className="input-label">Tasks Planned</label>
                            <textarea className="input-modern" name="plannedTasks" rows="2" value={form.plannedTasks} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Blockers</label>
                            <textarea className="input-modern" name="blockers" rows="2" value={form.blockers} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid-cols-2" style={{ marginBottom: 24 }}>
                        <div>
                            <label className="input-label">Hours Worked</label>
                            <input type="number" className="input-modern" name="hoursWorked" value={form.hoursWorked} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Notes</label>
                            <input type="text" className="input-modern" name="notes" value={form.notes} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button className="btn-modern btn-primary" onClick={() => submitReport("SUBMITTED")}>
                            <FiSend size={16} /> Submit
                        </button>
                        <button className="btn-modern btn-light" onClick={() => submitReport("DRAFT")}>
                            <FiSave size={16} /> Save Draft
                        </button>
                    </div>
                </div>
            )}

            <div className="ui-card">
                <h3 className="ui-card-title">Report History</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="table-ui">
                        <thead>
                            <tr>
                                <th>Week</th>
                                <th>Project</th>
                                <th>Status</th>
                                <th>Submitted Date</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                                        No reports yet.
                                    </td>
                                </tr>
                            ) : (
                                reports.sort((a, b) => b.id - a.id).map(r => (
                                    <tr key={r.id}>
                                        <td>{r.weekStart} — {r.weekEnd}</td>
                                        <td>{r.project ? r.project.name : "—"}</td>
                                        <td>
                                            <span className={`badge ${r.status === "SUBMITTED" ? "primary" : r.status === "APPROVED" ? "success" : r.status === "REJECTED" ? "danger" : "warning"}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "—"}</td>
                                        <td style={{ textAlign: "right" }}>
                                            {r.status === "DRAFT" || r.status === "REJECTED" ? (
                                                <>
                                                    <button className="btn-modern btn-light" style={{ padding: "8px", marginRight: 8 }} onClick={() => editReport(r)}>
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button className="btn-modern btn-light" style={{ padding: "8px", color: "var(--secondary)" }} onClick={() => deleteReport(r.id)}>
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </>
                                            ) : r.status === "SUBMITTED" ? (
                                                <>
                                                    <button className="btn-modern btn-light" style={{ padding: "8px", marginRight: 8 }} onClick={() => editReport(r)}>
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <span style={{ fontSize: 11, color: "var(--text-muted)", paddingRight: 8, fontStyle: "italic" }}>Pending Approval</span>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700, paddingRight: 8 }}>Approved (Finalized)</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
