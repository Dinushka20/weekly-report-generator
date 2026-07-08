import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ children, managerOnly }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (managerOnly && user.role !== "MANAGER") {
        return <Navigate to="/reports" />;
    }

    return children;
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={
                user ? <Navigate to={user.role === "MANAGER" ? "/" : "/reports"} /> : <Login />
            } />
            <Route path="/register" element={
                user ? <Navigate to={user.role === "MANAGER" ? "/" : "/reports"} /> : <Register />
            } />

            <Route path="/" element={
                <ProtectedRoute managerOnly>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/reports" element={
                <ProtectedRoute>
                    <Reports />
                </ProtectedRoute>
            } />
            <Route path="/projects" element={
                <ProtectedRoute>
                    <Projects />
                </ProtectedRoute>
            } />
            <Route path="/users" element={
                <ProtectedRoute managerOnly>
                    <Users />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;