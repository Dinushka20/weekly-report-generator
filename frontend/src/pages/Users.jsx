import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/users").then(res => setUsers(res.data));
    }, []);

    return (
        <MainLayout>
            <div className="ui-card">
                <h3 className="ui-card-title">Team Members</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="table-ui">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: "50%",
                                                background: "var(--primary-light)", color: "var(--primary)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 12, fontWeight: 700
                                            }}>
                                                {(u.firstName?.charAt(0) || "") + (u.lastName?.charAt(0) || "")}
                                            </div>
                                            {u.firstName} {u.lastName}
                                        </td>
                                        <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === "MANAGER" ? "warning" : "primary"}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
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
