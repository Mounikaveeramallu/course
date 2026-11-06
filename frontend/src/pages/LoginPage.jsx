import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  LogIn,
  AlertCircle,
  Loader,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Lock,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mode: "selection" | "student" | "admin"
  const [loginMode, setLoginMode] = useState("selection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectRole = (role) => {
    setLoginMode(role);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleBackToSelection = () => {
    setLoginMode("selection");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password, loginMode);
      if (data.success) {
        login(data.user, data.token);
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 16px",
        background: "radial-gradient(ellipse at top, #dbeafe 0%, #f8fafc 70%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
        className="animate-fade"
      >
        {/* VIEW 1: DUAL-OPTION SELECTION VIEW */}
        {loginMode === "selection" ? (
          <div>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  marginBottom: "14px",
                }}
              >
                <LogIn size={28} />
              </div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a" }}>
                Portal Login
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                Select your designated role to access the course portal
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {/* Option 1: Student Login */}
              <button
                type="button"
                onClick={() => handleSelectRole("student")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 20px",
                  background: "#ffffff",
                  border: "2px solid #bfdbfe",
                  borderRadius: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.06)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#bfdbfe";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                      Student Login
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                      Browse electives, submit registrations, track approval status
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="#2563eb" />
              </button>

              {/* Option 2: Admin Login */}
              <button
                type="button"
                onClick={() => handleSelectRole("admin")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 20px",
                  background: "#ffffff",
                  border: "2px solid #fecaca",
                  borderRadius: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.05)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#dc2626";
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#fecaca";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                      Admin Login
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                      Curriculum management, seat quotas, student approvals
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="#dc2626" />
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b" }}>
              Don't have an account yet?{" "}
              <Link to="/register" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>
                Register here
              </Link>
            </p>
          </div>
        ) : (
          /* VIEW 2: DEDICATED LOGIN FORM (Student or Admin) */
          <div>
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToSelection}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "none",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px",
                padding: "4px 0",
              }}
            >
              <ArrowLeft size={16} /> Back to Login Selection
            </button>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: loginMode === "admin" ? "#fee2e2" : "#eff6ff",
                  color: loginMode === "admin" ? "#dc2626" : "#2563eb",
                  marginBottom: "12px",
                }}
              >
                {loginMode === "admin" ? <ShieldCheck size={26} /> : <GraduationCap size={26} />}
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                {loginMode === "admin" ? "Admin Officer Login" : "Student Portal Login"}
              </h1>
              <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: "4px" }}>
                {loginMode === "admin"
                  ? "Enter authorized college admin credentials"
                  : "Enter your registered student credentials"}
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  color: "#b91c1c",
                  fontSize: "13.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    placeholder={loginMode === "admin" ? "admin@abc.edu" : "student@abc.edu"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 38px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <Mail
                    size={16}
                    color="#94a3b8"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 38px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <Lock
                    size={16}
                    color="#94a3b8"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background:
                    loginMode === "admin"
                      ? "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)"
                      : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow:
                    loginMode === "admin"
                      ? "0 4px 14px rgba(220, 38, 38, 0.35)"
                      : "0 4px 14px rgba(37, 99, 235, 0.35)",
                  marginTop: "8px",
                }}
              >
                {loading ? (
                  <Loader size={18} className="spin" />
                ) : (
                  <LogIn size={18} />
                )}{" "}
                Sign In as {loginMode === "admin" ? "Admin" : "Student"}
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
              }}
            >
              <button
                type="button"
                onClick={handleBackToSelection}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Switch Role
              </button>

              <Link
                to="/register"
                style={{ color: "#64748b", textDecoration: "none", fontWeight: "600" }}
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
