import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiFileText, FiFolder, FiUsers, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    function isActive(path) {
        return location.pathname === path ? "sidebar-link active" : "sidebar-link";
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                {/* Logo styling is handled by CSS ::before element to look like the reference chart icon */}
            </div>

            <nav className="sidebar-nav">
                {user?.role === "MANAGER" && (
                    <Link className={isActive("/")} to="/" title="Overview">
                        <FiHome />
                    </Link>
                )}

                <Link className={isActive("/reports")} to="/reports" title="My Reports">
                    <FiFileText />
                </Link>

                <Link className={isActive("/projects")} to="/projects" title="Projects">
                    <FiFolder />
                </Link>

                {user?.role === "MANAGER" && (
                    <Link className={isActive("/users")} to="/users" title="Team Members">
                        <FiUsers />
                    </Link>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout} title="Sign Out">
                    <FiLogOut />
                </button>
            </div>
        </aside>
    );
}