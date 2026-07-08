import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function MainLayout({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    const initials = user
        ? (user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "")
        : "";

    // Determine page title based on path
    let title = "Overview";
    if (location.pathname === "/reports") title = "My Reports";
    if (location.pathname === "/projects") title = "Projects";
    if (location.pathname === "/users") title = "Team Members";

    return (
        <div className="app-wrapper">
            <Sidebar />
            
            <main className="main-area">
                <header className="topbar">
                    <h1 className="page-title">{title}</h1>
                    
                    <div className="topbar-right">
                        <div className="search-bar">
                            <FiSearch color="var(--text-muted)" size={18} />
                            <input type="text" placeholder="Search something..." />
                        </div>

                        <div className="user-profile">
                            <span className="user-name">{user?.firstName} {user?.lastName}</span>
                            <FiChevronDown color="var(--text-muted)" size={16} />
                            <div className="user-avatar">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="scroll-area">
                    {children}
                </div>
            </main>
        </div>
    );
}