import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [project, setProject] = useState({ name: "", description: "", status: "ACTIVE" });

    useEffect(() => {
        loadProjects();
    }, []);

    function loadProjects() {
        api.get("/projects").then(res => setProjects(res.data));
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value });
    }

    function resetForm() {
        setProject({ name: "", description: "", status: "ACTIVE" });
        setEditingId(null);
        setShowForm(false);
    }

    function saveProject() {
        if (!project.name.trim()) return;
        if (editingId) {
            api.put("/projects/" + editingId, project).then(() => { resetForm(); loadProjects(); });
        } else {
            api.post("/projects", project).then(() => { resetForm(); loadProjects(); });
        }
    }

    function editProject(p) {
        setEditingId(p.id);
        setProject({ name: p.name, description: p.description, status: p.status });
        setShowForm(true);
    }

    function deleteProject(id) {
        if (confirm("Delete this project?")) {
            api.delete("/projects/" + id).then(() => loadProjects());
        }
    }

    return (
        <MainLayout>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                {!showForm && (
                    <button className="btn-modern btn-primary" onClick={() => setShowForm(true)}>
                        <FiPlus size={16} /> New Project
                    </button>
                )}
            </div>

            {showForm && (
                <div className="ui-card" style={{ marginBottom: 24 }}>
                    <h3 className="ui-card-title">
                        {editingId ? "Edit Project" : "Add Project"}
                        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }} onClick={resetForm}>
                            <FiX size={20} />
                        </button>
                    </h3>

                    <div className="grid-cols-2" style={{ marginBottom: 16 }}>
                        <div>
                            <label className="input-label">Project Name</label>
                            <input className="input-modern" name="name" value={project.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Status</label>
                            <select className="input-modern" name="status" value={project.status} onChange={handleChange}>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label className="input-label">Description</label>
                        <input className="input-modern" name="description" value={project.description} onChange={handleChange} />
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button className="btn-modern btn-primary" onClick={saveProject} disabled={!project.name.trim()}>
                            <FiCheck size={16} /> Save
                        </button>
                    </div>
                </div>
            )}

            <div className="ui-card">
                <h3 className="ui-card-title">All Projects</h3>
                <table className="table-ui">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No projects.</td></tr>
                        ) : (
                            projects.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td style={{ color: "var(--text-muted)" }}>{p.description || "—"}</td>
                                    <td>
                                        <span className={`badge ${p.status === 'ACTIVE' ? 'success' : p.status === 'ON_HOLD' ? 'warning' : 'primary'}`}>
                                            {p.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button className="btn-modern btn-light" style={{ padding: "8px", marginRight: 8 }} onClick={() => editProject(p)}>
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button className="btn-modern btn-light" style={{ padding: "8px", color: "var(--secondary)" }} onClick={() => deleteProject(p.id)}>
                                            <FiTrash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}