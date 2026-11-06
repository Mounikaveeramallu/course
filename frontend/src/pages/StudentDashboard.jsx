import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
  PlusCircle,
  FileText,
  AlertCircle,
  XCircle,
  ArrowRight,
  User,
  Award,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getMyCourses("all");
      if (res && res.registrations) {
        setRegistrations(res.registrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id, courseName) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for ${courseName}?`)) return;
    try {
      setCancellingId(id);
      await api.cancelRegistration(id);
      setMessage(`Registration for ${courseName} cancelled.`);
      loadData();
    } catch (err) {
      alert("Failed to cancel registration: " + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const totalRegistered = registrations.length;
  const approvedCount = registrations.filter((r) => r.approvalStatus === "Approved").length;
  const pendingCount = registrations.filter((r) => r.approvalStatus === "Pending").length;
  const totalCredits = registrations
    .filter((r) => r.approvalStatus === "Approved")
    .reduce((sum, r) => sum + (r.courseId?.credits || 0), 0);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "32px 16px" }}>
      <div className="container" style={{ maxWidth: "1140px" }}>
        {/* Welcome Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            color: "white",
            padding: "28px 32px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#bfdbfe", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              <GraduationCap size={16} /> MODULE 6: STUDENT DASHBOARD
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Welcome, {user?.name || "Student"}!
            </h1>
            <p style={{ color: "#e0e7ff", fontSize: "14px", marginTop: "4px" }}>
              Roll ID: <strong>{user?.userId || "STU2025"}</strong> &bull; {user?.department || "Computer Science"} &bull; Semester {user?.semester || 1}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/register-course"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "white",
                color: "#1d4ed8",
                padding: "10px 18px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <PlusCircle size={16} /> Register New Course
            </Link>
            <Link
              to="/profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "10px 18px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <User size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: "12px 18px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              color: "#1d4ed8",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontWeight: "bold" }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "32px",
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Total Registered</span>
              <BookOpen size={20} color="#2563eb" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
              {totalRegistered}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Across all semesters</div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Approved Registrations</span>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", marginTop: "8px" }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Confirmed seats</div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Pending Verification</span>
              <Clock size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b", marginTop: "8px" }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Awaiting admin action</div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Approved Credits</span>
              <Award size={20} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#8b5cf6", marginTop: "8px" }}>
              {totalCredits}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Earned towards degree</div>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                My Course Registrations
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b" }}>
                Real-time status of your course enrollment applications
              </p>
            </div>
            <Link
              to="/my-courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13.5px",
                fontWeight: "700",
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              View Full Registered List <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              Loading your course registrations...
            </div>
          ) : registrations.length === 0 ? (
            <div style={{ padding: "50px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                No Course Registrations Yet
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
                Browse available skill and elective courses offered by ABC Engineering College and submit your registration.
              </p>
              <Link
                to="/courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#2563eb",
                  color: "white",
                  padding: "10px 22px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                <PlusCircle size={16} /> Browse Available Courses
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Reg ID</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Course</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Semester</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Credits</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Faculty</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Approval Status</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    const c = reg.courseId || {};
                    const isPending = reg.approvalStatus === "Pending";
                    const isApproved = reg.approvalStatus === "Approved";

                    const badgeStyle = {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background: isApproved ? "#dcfce7" : isPending ? "#fef3c7" : "#fee2e2",
                      color: isApproved ? "#15803d" : isPending ? "#b45309" : "#b91c1c",
                    };

                    return (
                      <tr key={reg._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 20px", fontWeight: "600", color: "#64748b" }}>
                          {reg.registrationId || reg._id.slice(-6)}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>{c.courseName || "Unknown"}</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{c.courseCode}</div>
                        </td>
                        <td style={{ padding: "14px 20px", color: "#334155" }}>
                          Semester {c.semester || "-"}
                        </td>
                        <td style={{ padding: "14px 20px", color: "#334155", fontWeight: "600" }}>
                          {c.credits || "-"}
                        </td>
                        <td style={{ padding: "14px 20px", color: "#475569" }}>
                          {c.facultyName || "TBD"}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={badgeStyle}>
                            {isApproved && <CheckCircle size={13} />}
                            {isPending && <Clock size={13} />}
                            {!isApproved && !isPending && <XCircle size={13} />}
                            {reg.approvalStatus}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                          <button
                            onClick={() => handleCancel(reg._id, c.courseName)}
                            disabled={cancellingId === reg._id}
                            style={{
                              padding: "6px 12px",
                              background: "#fee2e2",
                              color: "#b91c1c",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            {cancellingId === reg._id ? "Cancelling..." : "Cancel"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
