import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import {
  ShieldCheck,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Search,
  Filter,
  PlusCircle,
  Loader,
  Check,
  X,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [regRes, reportRes] = await Promise.all([
        api.getAllRegistrations({ status: statusFilter, search: searchTerm }),
        api.getEnrollmentReports(),
      ]);

      if (regRes && regRes.registrations) {
        setRegistrations(regRes.registrations);
      }
      if (reportRes) {
        setReports(reportRes);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", text: "Failed to load admin data: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleStatusUpdate = async (regId, newStatus) => {
    try {
      setActionLoading(regId);
      const res = await api.approveRegistration(regId, newStatus);
      setAlert({
        type: "success",
        text: res.message || `Registration status updated to ${newStatus}.`,
      });
      fetchDashboardData();
    } catch (err) {
      setAlert({
        type: "error",
        text: err.message || "Failed to update registration status.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (regId) => {
    if (!window.confirm("Are you sure you want to remove this registration record?")) return;
    try {
      setActionLoading(regId);
      await api.cancelRegistration(regId);
      setAlert({ type: "success", text: "Registration record removed." });
      fetchDashboardData();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to remove registration: " + err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const summary = reports?.summary || {
    totalCourses: 0,
    totalStudents: 0,
    totalRegistrations: registrations.length,
    pendingCount: registrations.filter((r) => r.approvalStatus === "Pending").length,
    approvedCount: registrations.filter((r) => r.approvalStatus === "Approved").length,
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "32px 16px" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #dc2626 100%)",
            color: "white",
            padding: "28px 32px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(220, 38, 38, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fecaca", fontSize: "13px", fontWeight: "700" }}>
              <ShieldCheck size={16} /> MODULE 7: ADMIN DASHBOARD & APPROVAL PORTAL
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginTop: "4px" }}>
              Academic Administration Center
            </h1>
            <p style={{ color: "#fee2e2", fontSize: "14px", marginTop: "4px" }}>
              Verify student registrations, track elective quotas, and view automated enrollment reports.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/manage-courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "white",
                color: "#b91c1c",
                padding: "10px 18px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <PlusCircle size={16} /> Course Management (CRUD)
            </Link>
            <button
              onClick={fetchDashboardData}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
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

        {/* Metrics Row */}
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
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Total Courses</span>
              <BookOpen size={20} color="#2563eb" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
              {summary.totalCourses}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Across all 8 semesters</div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Registered Students</span>
              <Users size={20} color="#0284c7" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0284c7", marginTop: "8px" }}>
              {summary.totalStudents}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Total Student Accounts</div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Pending Approvals</span>
              <Clock size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b", marginTop: "8px" }}>
              {summary.pendingCount}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Requires verification</div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Approved Registrations</span>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", marginTop: "8px" }}>
              {summary.approvedCount}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Seats allocated</div>
          </div>
        </div>

        {/* Section 1: Student Registrations Table & Approvals */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
            marginBottom: "36px",
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
              gap: "14px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                Student Course Registrations & Approvals
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b" }}>
                Verify incoming requests, review eligibility, and approve or reject course allocations
              </p>
            </div>

            {/* Filter and search */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0 8px" }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search student or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: "none", background: "transparent", outline: "none", padding: "8px", fontSize: "13px", width: "160px" }}
                />
              </form>

              <div style={{ display: "flex", gap: "4px" }}>
                {["all", "Pending", "Approved", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      background: statusFilter === status ? "#b91c1c" : "#f1f5f9",
                      color: statusFilter === status ? "white" : "#475569",
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <Loader size={26} className="spin" style={{ margin: "0 auto 8px", color: "#dc2626" }} />
              <div>Loading registrations...</div>
            </div>
          ) : registrations.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
              No registrations found for the selected filter.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "12px 18px", fontWeight: "600" }}>Reg ID</th>
                    <th style={{ padding: "12px 18px", fontWeight: "600" }}>Student Details</th>
                    <th style={{ padding: "12px 18px", fontWeight: "600" }}>Course</th>
                    <th style={{ padding: "12px 18px", fontWeight: "600" }}>Date</th>
                    <th style={{ padding: "12px 18px", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "12px 18px", fontWeight: "600", textAlign: "right" }}>Review Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    const student = reg.studentId || {};
                    const course = reg.courseId || {};
                    const isPending = reg.approvalStatus === "Pending";
                    const isApproved = reg.approvalStatus === "Approved";
                    const isRejected = reg.approvalStatus === "Rejected";

                    return (
                      <tr key={reg._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 18px", fontWeight: "700", color: "#475569" }}>
                          {reg.registrationId || reg._id.slice(-6)}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>{student.name || "Unknown"}</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {student.userId || "STU"} &bull; {student.department || "CS"} &bull; Sem {student.semester || 1}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{student.email}</div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>{course.courseName || "Unknown"}</div>
                          <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
                            {course.courseCode} &bull; Sem {course.semester} &bull; {course.credits} Credits
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {course.seatsAvailable} seats remaining
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px", color: "#64748b", fontSize: "12.5px" }}>
                          {new Date(reg.registrationDate || reg.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
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
                        </td>
                        <td style={{ padding: "14px 18px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(reg._id, "Approved")}
                                  disabled={actionLoading === reg._id}
                                  title="Approve this registration"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "6px 12px",
                                    background: "#16a34a",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(reg._id, "Rejected")}
                                  disabled={actionLoading === reg._id}
                                  title="Reject this registration"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "6px 12px",
                                    background: "#fee2e2",
                                    color: "#b91c1c",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                  }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            ) : isApproved ? (
                              <button
                                onClick={() => handleStatusUpdate(reg._id, "Rejected")}
                                disabled={actionLoading === reg._id}
                                style={{
                                  padding: "6px 10px",
                                  background: "#fef2f2",
                                  color: "#b91c1c",
                                  border: "1px solid #fecaca",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                Revoke Approval
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusUpdate(reg._id, "Approved")}
                                disabled={actionLoading === reg._id}
                                style={{
                                  padding: "6px 10px",
                                  background: "#f0fdf4",
                                  color: "#16a34a",
                                  border: "1px solid #bbf7d0",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                Re-Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(reg._id)}
                              disabled={actionLoading === reg._id}
                              title="Delete record"
                              style={{
                                padding: "6px",
                                background: "#f1f5f9",
                                color: "#64748b",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Enrollment Reports (MongoDB Aggregation) */}
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
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563eb", fontSize: "12px", fontWeight: "700" }}>
                <BarChart3 size={15} /> WORKING PRINCIPLE #9: ENROLLMENT REPORTS
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                Course-wise Enrollment & Capacity Analytics
              </h2>
            </div>
            <div style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "600" }}>
              Generated live via MongoDB <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>aggregate()</code>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            {reports?.courseStats && reports.courseStats.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
                {reports.courseStats.map((item) => {
                  const total = item.totalSeats || 60;
                  const approved = item.approvedCount || 0;
                  const pct = Math.min(100, Math.round((approved / total) * 100));

                  return (
                    <div
                      key={item._id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "18px",
                        background: "#f8fafc",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "800", color: "#1e3a8a", fontSize: "13px" }}>
                          {item.courseCode}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                          Sem {item.semester}
                        </span>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                        {item.courseName}
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span style={{ color: "#64748b" }}>Seat Occupancy</span>
                          <span style={{ fontWeight: "700", color: pct > 80 ? "#dc2626" : "#2563eb" }}>
                            {approved} / {total} ({pct}%)
                          </span>
                        </div>
                        <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: pct > 80 ? "#dc2626" : "#2563eb",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#475569" }}>
                        <span>Total Requests: <strong>{item.totalRegistrations}</strong></span>
                        <span>Pending: <strong style={{ color: "#b45309" }}>{item.pendingCount}</strong></span>
                        <span>Approved: <strong style={{ color: "#15803d" }}>{item.approvedCount}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                No enrollment report data currently available. Registrations will automatically generate metrics here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
