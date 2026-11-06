import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  ArrowLeft,
  Loader,
  PlusCircle,
  Filter,
  Calendar,
  Award,
} from "lucide-react";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.getMyCourses(statusFilter);
      if (res.success) {
        setRegistrations(res.registrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyRegistrations();
  }, [user, statusFilter]);

  const handleCancel = async (registrationId, courseName) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for ${courseName || "this course"}?`)) {
      return;
    }

    try {
      setCancellingId(registrationId);
      const res = await api.cancelRegistration(registrationId);
      setAlert({
        type: "success",
        text: res.message || "Registration cancelled successfully.",
      });
      fetchMyRegistrations();
    } catch (err) {
      setAlert({
        type: "error",
        text: err.message || "Failed to cancel registration.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const totalRegistered = registrations.length;
  const approvedCount = registrations.filter((r) => r.approvalStatus === "Approved").length;
  const pendingCount = registrations.filter((r) => r.approvalStatus === "Pending").length;
  const approvedCredits = registrations
    .filter((r) => r.approvalStatus === "Approved")
    .reduce((sum, r) => sum + (r.courseId?.credits || 0), 0);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "32px 16px" }}>
      <div className="container">
        <Link
          to="/student-dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#64748b",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          <ArrowLeft size={16} /> Back to Student Dashboard
        </Link>

        {/* Overview Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            borderRadius: "16px",
            padding: "32px 28px",
            color: "white",
            marginBottom: "28px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", color: "#93c5fd", fontWeight: "700", letterSpacing: "0.5px" }}>
              MODULE 5: REGISTERED COURSE LIST
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginTop: "4px" }}>
              My Registered Courses
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "4px" }}>
              Student: <strong>{user?.name}</strong> &bull; Roll: <strong>{user?.userId || "STU2025"}</strong> &bull; Sem {user?.semester || 1} &bull; {user?.department || "Computer Science"}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              background: "rgba(255,255,255,0.08)",
              padding: "14px 22px",
              borderRadius: "12px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700" }}>TOTAL REGISTERED</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>{totalRegistered}</div>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.2)" }}></div>
            <div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700" }}>APPROVED SEATS</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#4ade80" }}>{approvedCount}</div>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.2)" }}></div>
            <div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700" }}>APPROVED CREDITS</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#38bdf8" }}>{approvedCredits}</div>
            </div>
          </div>
        </div>

        {alert && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: alert.type === "success" ? "#dcfce7" : "#fee2e2",
              color: alert.type === "success" ? "#15803d" : "#b91c1c",
              border: `1px solid ${alert.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <span>{alert.text}</span>
            <button
              onClick={() => setAlert(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div
          style={{
            background: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>Filter by Status:</span>
            {["all", "Approved", "Pending", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  background: statusFilter === status ? "#2563eb" : "#f1f5f9",
                  color: statusFilter === status ? "white" : "#475569",
                  textTransform: "capitalize",
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <Link
            to="/register-course"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#2563eb",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: "700",
            }}
          >
            <PlusCircle size={15} /> Add Another Course
          </Link>
        </div>

        {/* Registered Cards List */}
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
            <Loader size={32} className="spin" style={{ margin: "0 auto 12px", color: "#2563eb" }} />
            <div>Fetching your registered courses...</div>
          </div>
        ) : registrations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <BookOpen size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
              No Registrations Found
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px", marginBottom: "20px" }}>
              {statusFilter !== "all"
                ? `You have no courses with status "${statusFilter}".`
                : "You haven't submitted any course registrations yet."}
            </p>
            <Link
              to="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 20px",
                background: "#2563eb",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              <PlusCircle size={16} /> Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "22px" }}>
            {registrations.map((reg) => {
              const course = reg.courseId || {};
              const isApproved = reg.approvalStatus === "Approved";
              const isPending = reg.approvalStatus === "Pending";
              const isRejected = reg.approvalStatus === "Rejected";

              return (
                <div
                  key={reg._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Top metadata */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "800",
                        }}
                      >
                        {course.courseCode || "CODE"}
                      </span>

                      {/* Approval Status Badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: isApproved ? "#dcfce7" : isPending ? "#fef3c7" : "#fee2e2",
                          color: isApproved ? "#15803d" : isPending ? "#b45309" : "#b91c1c",
                        }}
                      >
                        {isApproved && <CheckCircle size={13} />}
                        {isPending && <Clock size={13} />}
                        {isRejected && <XCircle size={13} />}
                        {reg.approvalStatus}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "6px", lineHeight: "1.3" }}>
                      {course.courseName || "Unknown Course"}
                    </h3>

                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "16px" }}>
                      {course.description || "Course registration verified for semester elective."}
                    </p>

                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Registration ID:</span>
                        <span style={{ fontWeight: "700", color: "#0f172a" }}>{reg.registrationId || reg._id.slice(-6)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Faculty:</span>
                        <span style={{ fontWeight: "600", color: "#1e293b" }}>{course.facultyName || "TBD"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Semester & Credits:</span>
                        <span style={{ fontWeight: "700", color: "#2563eb" }}>
                          Sem {course.semester} &bull; {course.credits} Credits
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Registered Date:</span>
                        <span style={{ color: "#475569" }}>
                          {new Date(reg.registrationDate || reg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {reg.adminComments && (
                        <div style={{ marginTop: "4px", paddingTop: "4px", borderTop: "1px dashed #cbd5e1", color: "#0369a1", fontSize: "12px" }}>
                          <strong>Admin Note:</strong> {reg.adminComments}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleCancel(reg._id, course.courseName)}
                      disabled={cancellingId === reg._id}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fee2e2",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: cancellingId === reg._id ? "not-allowed" : "pointer",
                      }}
                    >
                      <Trash2 size={15} />
                      {cancellingId === reg._id ? "Cancelling..." : "Cancel Registration"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
