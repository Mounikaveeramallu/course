import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  CheckSquare,
  ShieldCheck,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    color: isActive(path) ? "#2563eb" : "#475569",
    padding: "8px 12px",
    borderRadius: "8px",
    backgroundColor: isActive(path) ? "#eff6ff" : "transparent",
    transition: "all 0.15s ease",
  });

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "72px",
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              color: "white",
              padding: "9px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.25)",
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.5px", color: "#0f172a" }}>
              ABC Engineering College
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", letterSpacing: "0.5px" }}>
              AUTONOMOUS CBCS • COURSE REGISTRATION PORTAL
            </div>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav
          style={{ display: "none", alignItems: "center", gap: "6px" }}
          className="desktop-nav"
        >
          <Link to="/" style={linkStyle("/")}>
            Home
          </Link>

          <Link to="/courses" style={linkStyle("/courses")}>
            <BookOpen size={16} /> Available Courses
          </Link>

          {isStudent && (
            <>
              <Link to="/student-dashboard" style={linkStyle("/student-dashboard")}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/register-course" style={linkStyle("/register-course")}>
                <PlusCircle size={16} /> Register Course
              </Link>
              <Link to="/my-courses" style={linkStyle("/my-courses")}>
                <CheckSquare size={16} /> My Courses
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin-dashboard" style={linkStyle("/admin-dashboard")}>
                <LayoutDashboard size={16} /> Admin Dashboard
              </Link>
              <Link to="/manage-courses" style={linkStyle("/manage-courses")}>
                <ShieldCheck size={16} /> Manage Courses
              </Link>
            </>
          )}

          {/* User Info & Actions */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "14px" }}>
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "24px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                }}
                title="View & Update Profile"
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: isAdmin ? "#fee2e2" : "#dbeafe",
                    color: isAdmin ? "#b91c1c" : "#1d4ed8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", lineHeight: "1.2" }}>
                    {user.name?.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: "10px", color: isAdmin ? "#dc2626" : "#2563eb", fontWeight: "700", textTransform: "uppercase" }}>
                    {user.role}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign out"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "8px",
                  color: "#475569",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "10px" }}>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#334155",
                  padding: "8px 16px",
                  borderRadius: "8px",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "white",
                  background: "#2563eb",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "block",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#334155",
            padding: "8px",
          }}
          className="mobile-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: "16px 20px 24px",
            background: "#ffffff",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/")}>
            Home
          </Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/courses")}>
            Available Courses
          </Link>

          {isStudent && (
            <>
              <Link to="/student-dashboard" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/student-dashboard")}>
                Student Dashboard
              </Link>
              <Link to="/register-course" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/register-course")}>
                Register Course
              </Link>
              <Link to="/my-courses" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/my-courses")}>
                My Courses
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/profile")}>
                Update Profile
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/admin-dashboard")}>
                Admin Dashboard
              </Link>
              <Link to="/manage-courses" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/manage-courses")}>
                Manage Courses
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={linkStyle("/profile")}>
                Profile
              </Link>
            </>
          )}

          {user ? (
            <div style={{ paddingTop: "12px", borderTop: "1px solid #f1f5f9", marginTop: "6px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>
                Signed in as {user.name} ({user.role})
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px" }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textAlign: "center",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#334155",
                  fontWeight: "600",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textAlign: "center",
                  padding: "10px",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 880px) {
          .desktop-nav { display: flex !important; }
          .mobile-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
