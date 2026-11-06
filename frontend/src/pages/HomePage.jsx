import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Cpu,
  Radio,
  Zap,
  Cog,
  Building,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coursesCount, setCoursesCount] = useState(30);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.getCourses()
      .then((data) => {
        if (data && data.courses) {
          setCoursesCount(data.count || data.courses.length);
          setFeaturedCourses(data.courses.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  const departments = [
    {
      name: "Computer Science & Engineering",
      code: "CSE",
      icon: Cpu,
      color: "#2563eb",
      bgColor: "#eff6ff",
      desc: "Full Stack, Cloud Computing, AI & Machine Learning, Data Structures",
    },
    {
      name: "Electronics & Communication",
      code: "ECE",
      icon: Radio,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
      desc: "VLSI Design, Embedded Systems, IoT, Digital Signal Processing",
    },
    {
      name: "Electrical & Electronics",
      code: "EEE",
      icon: Zap,
      color: "#d97706",
      bgColor: "#fffbeb",
      desc: "Power Systems, Renewable Energy, Electric Vehicles, Smart Grids",
    },
    {
      name: "Mechanical Engineering",
      code: "MECH",
      icon: Cog,
      color: "#059669",
      bgColor: "#ecfdf5",
      desc: "Robotics, Thermal Engineering, CAD/CAM, Automobile Systems",
    },
    {
      name: "Civil Engineering",
      code: "CIVIL",
      icon: Building,
      color: "#dc2626",
      bgColor: "#fef2f2",
      desc: "Structural Analysis, Smart Cities, GIS, Environmental Engineering",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)",
          color: "white",
          padding: "70px 20px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ maxWidth: "900px", position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              padding: "6px 18px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Sparkles size={15} color="#93c5fd" />
            <span>Autonomous CBCS Academic Curriculum Portal</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: "800",
              lineHeight: "1.2",
              marginBottom: "18px",
              letterSpacing: "-1px",
            }}
          >
            ABC Engineering College <br />
            <span style={{ color: "#93c5fd" }}>Course Registration Portal</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              color: "#cbd5e1",
              maxWidth: "720px",
              margin: "0 auto 32px",
              lineHeight: "1.6",
            }}
          >
            A unified digital course registration platform for students across all engineering branches. Explore CBCS electives, submit enrollment requests, and track administrative verification in real-time.
          </p>

          {/* Course Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              maxWidth: "560px",
              margin: "0 auto 36px",
              display: "flex",
              background: "white",
              borderRadius: "12px",
              padding: "6px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "12px", color: "#94a3b8" }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by course name, code (e.g. CS201), or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "10px 14px",
                fontSize: "15px",
                color: "#1e293b",
                borderRadius: "8px",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 22px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#2563eb",
                color: "white",
                padding: "14px 28px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              }}
            >
              <BookOpen size={18} /> Available Courses
            </Link>

            {!user ? (
              <>
                <Link
                  to="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "white",
                    color: "#0f172a",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "15px",
                  }}
                >
                  Register <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                >
                  Portal Login
                </Link>
              </>
            ) : user.role === "admin" ? (
              <Link
                to="/admin-dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#10b981",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                Go to Admin Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/student-dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#10b981",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                Go to Student Dashboard <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section style={{ transform: "translateY(-30px)", position: "relative", zIndex: 20 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              { label: "Active Courses", val: `${coursesCount}+`, desc: "Multi-Department CBCS Electives", icon: BookOpen, color: "#2563eb" },
              { label: "Engineering Disciplines", val: "5 Branches", desc: "CSE, ECE, EEE, Mech & Civil", icon: Cpu, color: "#7c3aed" },
              { label: "Instant Seat Allocation", val: "Real-Time", desc: "Transparent Quota Tracking", icon: CheckCircle2, color: "#10b981" },
              { label: "Administrative Control", val: "100% Verified", desc: "Official Dean & Faculty Approvals", icon: ShieldCheck, color: "#dc2626" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: "white",
                    padding: "20px 24px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: `${stat.color}15`,
                      color: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{stat.val}</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>{stat.label}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{stat.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engineering Departments Section */}
      <section style={{ padding: "40px 20px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              Academic Engineering Departments
            </h2>
            <p style={{ color: "#64748b", fontSize: "15px" }}>
              Explore elective and core courses available across all recognized engineering programs
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <Link
                  key={idx}
                  to={`/courses?dept=${encodeURIComponent(dept.name)}`}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    padding: "24px 20px",
                    textDecoration: "none",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.06)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: dept.bgColor,
                        color: dept.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                      {dept.name}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: "1.5" }}>
                      {dept.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: dept.color,
                      marginTop: "16px",
                    }}
                  >
                    View Courses <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section style={{ padding: "40px 20px 60px", background: "#f1f5f9" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#2563eb", letterSpacing: "0.5px" }}>
                CURRICULUM HIGHLIGHTS
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
                Featured CBCS Elective Offerings
              </h2>
            </div>
            <Link
              to="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#2563eb",
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Browse All Courses ({coursesCount}) <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "22px",
            }}
          >
            {featuredCourses.map((c) => (
              <div
                key={c._id}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "24px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "800" }}>
                      {c.courseCode}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                      Semester {c.semester}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                    {c.courseName}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", marginBottom: "8px" }}>
                    {c.department || "Computer Science & Engineering"}
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "16px" }}>
                    {c.description || "Course curriculum covering theory and hands-on laboratory work."}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "13px", color: "#475569" }}>
                    Instructor: <strong>{c.facultyName}</strong>
                  </div>
                  <Link
                    to={`/courses`}
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "40px 20px", textAlign: "center", fontSize: "13px" }}>
        <div className="container">
          <div style={{ fontWeight: "800", color: "white", fontSize: "16px", marginBottom: "8px" }}>
            ABC Engineering College — Course Registration Portal
          </div>
          <p style={{ maxWidth: "600px", margin: "0 auto 16px", lineHeight: "1.6" }}>
            Autonomous Choice Based Credit System (CBCS). Designed for seamless enrollment, curriculum management, and academic administration.
          </p>
          <div style={{ color: "#64748b", fontSize: "12px" }}>
            © {new Date().getFullYear()} ABC Engineering College. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
