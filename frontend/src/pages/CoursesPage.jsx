import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Search,
  Users,
  Filter,
  PlusCircle,
  Loader,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function CoursesPage() {
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get("dept") || "all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [registeringId, setRegisteringId] = useState(null);
  const [bannerMessage, setBannerMessage] = useState(null);

  const departments = [
    "All Departments",
    "Computer Science & Engineering",
    "Electronics & Communication",
    "Electrical & Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  const fetchCoursesAndRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.getCourses({
        semester: selectedSemester,
        department: selectedDepartment,
        search,
      });
      setCourses(res.courses || []);

      if (user && isStudent) {
        const regRes = await api.getMyCourses("all").catch(() => null);
        if (regRes && regRes.registrations) {
          setMyRegistrations(regRes.registrations);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndRegistrations();
  }, [selectedSemester, selectedDepartment]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCoursesAndRegistrations();
  };

  const handleRegister = async (course) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      alert("Admin accounts cannot register for student courses. Please use a student account.");
      return;
    }

    if (course.seatsAvailable <= 0) {
      alert("Registration closed: No seats available for this course.");
      return;
    }

    try {
      setRegisteringId(course._id);
      const res = await api.registerCourse(course._id);
      setBannerMessage({
        type: "success",
        text: res.message || `Registered for ${course.courseName} successfully! Awaiting admin approval.`,
      });
      fetchCoursesAndRegistrations();
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: err.message || "Registration failed.",
      });
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "32px 16px" }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563eb", fontSize: "13px", fontWeight: "700" }}>
            <BookOpen size={16} /> ABC ENGINEERING COLLEGE • COURSE CATALOG
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
            Available Courses
          </h1>
          <p style={{ color: "#64748b", fontSize: "14.5px", marginTop: "4px" }}>
            Browse accredited elective and skill-enhancement courses across all engineering departments.
          </p>
        </div>

        {bannerMessage && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: bannerMessage.type === "success" ? "#dcfce7" : "#fee2e2",
              color: bannerMessage.type === "success" ? "#15803d" : "#b91c1c",
              border: `1px solid ${bannerMessage.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <span>{bannerMessage.text}</span>
            <button
              onClick={() => setBannerMessage(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div
          style={{
            background: "white",
            padding: "18px 20px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
            marginBottom: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              flex: "1 1 300px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              padding: "2px 12px",
            }}
          >
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search course name, code (e.g. CS201), faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  fetchCoursesAndRegistrations();
                }}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
              >
                &times;
              </button>
            )}
          </form>

          {/* Department Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
              <Building size={15} /> Department:
            </span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "13.5px",
                background: "white",
                outline: "none",
                cursor: "pointer",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              <option value="all">All Departments</option>
              {departments.filter((d) => d !== "All Departments").map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
              <Filter size={15} /> Semester:
            </span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "13.5px",
                background: "white",
                outline: "none",
                cursor: "pointer",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department Pills Bar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "20px",
          }}
        >
          {departments.map((dept) => {
            const isSelected =
              (dept === "All Departments" && (selectedDepartment === "all" || !selectedDepartment)) ||
              selectedDepartment === dept;

            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDepartment(dept === "All Departments" ? "all" : dept)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: isSelected ? "1px solid #2563eb" : "1px solid #e2e8f0",
                  background: isSelected ? "#2563eb" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#475569",
                  fontSize: "13px",
                  fontWeight: isSelected ? "700" : "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
            <Loader size={32} className="spin" style={{ margin: "0 auto 12px", color: "#2563eb" }} />
            <div>Fetching available courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ background: "white", padding: "60px 20px", borderRadius: "16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <BookOpen size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#334155" }}>No Courses Found</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "6px" }}>
              Try adjusting your search terms or clearing the department and semester filters.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "22px",
            }}
          >
            {courses.map((course) => {
              const existingReg = myRegistrations.find(
                (r) => r.courseId?._id === course._id || r.courseId === course._id
              );
              const isFull = course.seatsAvailable <= 0;

              return (
                <div
                  key={course._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div>
                    {/* Header tags */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "800",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {course.courseCode}
                      </span>
                      <span
                        style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Semester {course.semester}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "6px", lineHeight: "1.3" }}>
                      {course.courseName}
                    </h3>

                    <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", marginBottom: "10px" }}>
                      {course.department || "Computer Science & Engineering"}
                    </div>

                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "18px" }}>
                      {course.description || "Comprehensive university course curriculum and practical exercises."}
                    </p>

                    {/* Metadata Specs */}
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginBottom: "18px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Instructor:</span>
                        <span style={{ fontWeight: "600", color: "#1e293b" }}>{course.facultyName}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Credits:</span>
                        <span style={{ fontWeight: "700", color: "#2563eb" }}>{course.credits} Credits</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Seat Quota:</span>
                        <span style={{ fontWeight: "600", color: isFull ? "#dc2626" : "#10b981" }}>
                          {course.seatsAvailable} of {course.totalSeats || 60} Left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {existingReg ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          borderRadius: "8px",
                          background: existingReg.approvalStatus === "Approved" ? "#dcfce7" : "#fef3c7",
                          color: existingReg.approvalStatus === "Approved" ? "#15803d" : "#b45309",
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        Registered ({existingReg.approvalStatus})
                      </div>
                    ) : isFull ? (
                      <button
                        disabled
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          background: "#e2e8f0",
                          color: "#94a3b8",
                          border: "none",
                          fontWeight: "700",
                          fontSize: "13.5px",
                          cursor: "not-allowed",
                        }}
                      >
                        Seats Full
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleRegister(course)}
                          disabled={registeringId === course._id}
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRadius: "8px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            fontWeight: "700",
                            fontSize: "13.5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          {registeringId === course._id ? (
                            <Loader size={15} className="spin" />
                          ) : (
                            <PlusCircle size={15} />
                          )}
                          Register
                        </button>

                        <Link
                          to={`/register-course?id=${course._id}`}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            fontWeight: "600",
                            fontSize: "13px",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Details
                        </Link>
                      </div>
                    )}
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
