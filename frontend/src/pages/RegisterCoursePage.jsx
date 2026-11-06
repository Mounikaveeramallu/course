import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader,
  GraduationCap,
  Calendar,
  User,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function RegisterCoursePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get("id");

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    api.getCourses()
      .then((res) => {
        setCourses(res.courses || []);
        if (!selectedCourseId && res.courses?.length > 0) {
          setSelectedCourseId(res.courses[0]._id);
        }
      })
      .catch((err) => setError("Failed to load courses: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedCourse = courses.find((c) => c._id === selectedCourseId) || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setError("Please select a course to register.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the enrollment guidelines.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await api.registerCourse(selectedCourseId);
      setSuccessResult(res.registration);
    } catch (err) {
      setError(err.message || "Failed to submit course registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "36px 16px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Breadcrumb / Title */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563eb", fontSize: "13px", fontWeight: "700" }}>
            <BookOpen size={16} /> MODULE 4: COURSE REGISTRATION
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
            Register for Elective Course
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            Submit an official enrollment request for department verification and seat allocation.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "14px 18px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              color: "#b91c1c",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successResult ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #bbf7d0",
              padding: "40px 32px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.1)",
            }}
            className="animate-fade"
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              Registration Submitted Successfully!
            </h2>
            <p style={{ color: "#475569", fontSize: "15px", maxWidth: "520px", margin: "0 auto 24px" }}>
              Your application for <strong>{selectedCourse?.courseName} ({selectedCourse?.courseCode})</strong> has been received with Registration ID: <strong>{successResult.registrationId}</strong>.
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: "20px",
                background: "#fef3c7",
                color: "#b45309",
                fontWeight: "700",
                fontSize: "14px",
                marginBottom: "32px",
              }}
            >
              Current Status: Pending Admin Verification
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/my-courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#2563eb",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                View in My Courses <ArrowRight size={16} />
              </Link>
              <Link
                to="/courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#f1f5f9",
                  color: "#334155",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Register Another Course
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "32px",
              boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
            }}
          >
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                <Loader size={28} className="spin" style={{ margin: "0 auto 10px", color: "#2563eb" }} />
                <div>Loading courses catalog...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Course Selection Dropdown */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                    Select Course to Register *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "15px",
                      background: "white",
                      outline: "none",
                      boxSizing: "border-box",
                      fontWeight: "600",
                      color: "#0f172a",
                    }}
                  >
                    {courses.map((c) => (
                      <option key={c._id} value={c._id} disabled={c.seatsAvailable <= 0}>
                        {c.courseCode} — {c.courseName} (Sem {c.semester}, {c.credits} Credits) {c.seatsAvailable <= 0 ? "— [FULL]" : `— ${c.seatsAvailable} seats left`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Course Card Preview */}
                {selectedCourse && (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {selectedCourse.courseCode}
                        </span>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginTop: "6px" }}>
                          {selectedCourse.courseName}
                        </h3>
                      </div>
                      <span
                        style={{
                          background: selectedCourse.seatsAvailable > 0 ? "#dcfce7" : "#fee2e2",
                          color: selectedCourse.seatsAvailable > 0 ? "#15803d" : "#b91c1c",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {selectedCourse.seatsAvailable > 0 ? `${selectedCourse.seatsAvailable} Seats Available` : "No Seats Left"}
                      </span>
                    </div>

                    <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: "1.5", marginBottom: "16px" }}>
                      {selectedCourse.description || "Course details and curriculum verified by ABC College Academic Department."}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ background: "white", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ color: "#64748b", display: "block" }}>Faculty In-charge:</span>
                        <span style={{ fontWeight: "700", color: "#1e293b" }}>{selectedCourse.facultyName}</span>
                      </div>
                      <div style={{ background: "white", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ color: "#64748b", display: "block" }}>Semester:</span>
                        <span style={{ fontWeight: "700", color: "#1e293b" }}>Semester {selectedCourse.semester}</span>
                      </div>
                      <div style={{ background: "white", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ color: "#64748b", display: "block" }}>Credits:</span>
                        <span style={{ fontWeight: "700", color: "#2563eb" }}>{selectedCourse.credits} Credits</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Details Summary */}
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    fontSize: "13.5px",
                  }}
                >
                  <div style={{ fontWeight: "700", color: "#1d4ed8", marginBottom: "6px" }}>
                    Student Applicant Information
                  </div>
                  <div style={{ color: "#1e3a8a", display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    <span><strong>Name:</strong> {user?.name}</span>
                    <span><strong>Roll ID:</strong> {user?.userId || "STU2025"}</span>
                    <span><strong>Department:</strong> {user?.department || "Computer Science"}</span>
                    <span><strong>Current Sem:</strong> {user?.semester || 1}</span>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div style={{ marginBottom: "28px" }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      style={{ marginTop: "3px" }}
                    />
                    <span>
                      I declare that I meet the course pre-requisites and agree that this registration is subject to verification and approval by the ABC Engineering College Administrative Office.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting || (selectedCourse && selectedCourse.seatsAvailable <= 0)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  }}
                >
                  {submitting ? <Loader size={18} className="spin" /> : <CheckCircle2 size={18} />}
                  Confirm & Submit Registration
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
