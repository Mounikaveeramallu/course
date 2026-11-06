import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  AlertCircle,
  Loader,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  KeyRound,
} from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mode: "selection" | "student" | "admin"
  const [registerMode, setRegisterMode] = useState("selection");

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    userId: "",
    phone: "",
    department: "Computer Science & Engineering",
    semester: 1,
    password: "",
    confirmPassword: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    userId: "",
    phone: "",
    department: "Academic Administration",
    adminSecretKey: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectRole = (role) => {
    setRegisterMode(role);
    setError("");
  };

  const handleBackToSelection = () => {
    setRegisterMode("selection");
    setError("");
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (studentForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (studentForm.password !== studentForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({
        name: studentForm.name,
        email: studentForm.email,
        userId: studentForm.userId,
        phone: studentForm.phone,
        department: studentForm.department,
        semester: Number(studentForm.semester),
        password: studentForm.password,
        role: "student",
      });

      if (data.success) {
        login(data.user, data.token);
        navigate("/student-dashboard");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!adminForm.adminSecretKey.trim()) {
      setError("Admin Security Passkey is required to register an administrative account.");
      return;
    }

    if (adminForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({
        name: adminForm.name,
        email: adminForm.email,
        userId: adminForm.userId,
        phone: adminForm.phone,
        department: adminForm.department,
        adminSecretKey: adminForm.adminSecretKey,
        password: adminForm.password,
        role: "admin",
      });

      if (data.success) {
        login(data.user, data.token);
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Admin registration failed.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the backend server.");
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
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
        className="animate-fade"
      >
        {/* VIEW 1: DUAL-OPTION SELECTION VIEW */}
        {registerMode === "selection" ? (
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
                <UserPlus size={28} />
              </div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a" }}>
                Create Account
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                Select account type to begin registration
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {/* Option 1: Student Registration */}
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
                      Student Registration
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                      For undergraduate & postgraduate students registering for electives
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="#2563eb" />
              </button>

              {/* Option 2: Admin Registration */}
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
                      Admin Registration
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                      Requires authorized institutional security key
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="#dc2626" />
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b" }}>
              Already registered?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>
                Sign In here
              </Link>
            </p>
          </div>
        ) : registerMode === "student" ? (
          /* VIEW 2A: STUDENT REGISTRATION FORM */
          <div>
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
              <ArrowLeft size={16} /> Back to Registration Selection
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
                  background: "#eff6ff",
                  color: "#2563eb",
                  marginBottom: "12px",
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                Student Registration
              </h1>
              <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: "4px" }}>
                Fill in your details to create your student account
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

            <form onSubmit={handleStudentSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Student Roll / ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU2025101"
                    value={studentForm.userId}
                    onChange={(e) => setStudentForm({ ...studentForm, userId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                  Institutional Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@abc.edu"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Department *
                  </label>
                  <select
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                      background: "white",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Semester *
                  </label>
                  <select
                    value={studentForm.semester}
                    onChange={(e) => setStudentForm({ ...studentForm, semester: Number(e.target.value) })}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                      background: "white",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Password (min 6) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
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
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  marginTop: "6px",
                }}
              >
                {loading ? <Loader size={18} className="spin" /> : <UserPlus size={18} />} Complete Student Registration
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "20px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>
                Sign In
              </Link>
            </p>
          </div>
        ) : (
          /* VIEW 2B: ADMIN REGISTRATION FORM */
          <div>
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
              <ArrowLeft size={16} /> Back to Registration Selection
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
                  background: "#fee2e2",
                  color: "#dc2626",
                  marginBottom: "12px",
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                Admin Officer Registration
              </h1>
              <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: "4px" }}>
                Requires authorized institution security passkey
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

            <form onSubmit={handleAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                  Full Administrator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. K. Ramanathan"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Staff / Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADM202501"
                    value={adminForm.userId}
                    onChange={(e) => setAdminForm({ ...adminForm, userId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@abc.edu"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Admin Security Passkey */}
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#991b1b",
                    marginBottom: "5px",
                  }}
                >
                  <KeyRound size={15} /> Admin Security Passkey *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrative authorization key"
                  value={adminForm.adminSecretKey}
                  onChange={(e) => setAdminForm({ ...adminForm, adminSecretKey: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #fca5a5",
                    fontSize: "14px",
                    outline: "none",
                    background: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontSize: "11.5px", color: "#b91c1c", marginTop: "4px", display: "block" }}>
                  Authorized key provided by Academic Dean or Registrar office
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Password (min 6) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "5px" }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminForm.confirmPassword}
                    onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
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
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                  marginTop: "6px",
                }}
              >
                {loading ? <Loader size={18} className="spin" /> : <ShieldCheck size={18} />} Register Admin Account
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "20px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
