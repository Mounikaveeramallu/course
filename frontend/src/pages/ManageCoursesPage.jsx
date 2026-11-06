import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader,
  ArrowLeft,
  X,
  Save,
  Building,
} from "lucide-react";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const departments = [
    "Computer Science & Engineering",
    "Electronics & Communication",
    "Electrical & Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  const initialForm = {
    courseId: "",
    courseCode: "",
    courseName: "",
    department: "Computer Science & Engineering",
    semester: 3,
    facultyName: "",
    credits: 4,
    seatsAvailable: 60,
    totalSeats: 60,
    description: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.getCourses({
        semester: selectedSemester,
        department: selectedDepartment,
        search,
      });
      setCourses(res.courses || []);
    } catch (err) {
      setAlert({ type: "error", text: "Failed to load courses: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedSemester, selectedDepartment]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId || course.courseCode,
      courseCode: course.courseCode,
      courseName: course.courseName,
      department: course.department || "Computer Science & Engineering",
      semester: course.semester,
      facultyName: course.facultyName,
      credits: course.credits,
      seatsAvailable: course.seatsAvailable,
      totalSeats: course.totalSeats || course.seatsAvailable,
      description: course.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCourse) {
        // Edit course
        const res = await api.updateCourse(editingCourse._id, formData);
        setAlert({ type: "success", text: res.message || "Course updated successfully!" });
      } else {
        // Add new course
        const res = await api.createCourse(formData);
        setAlert({ type: "success", text: res.message || "New course added successfully!" });
      }
      closeModal();
      fetchCourses();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to save course." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to delete '${courseName}'? This will also remove any student registrations for this course.`)) {
      return;
    }

    try {
      const res = await api.deleteCourse(courseId);
      setAlert({ type: "success", text: res.message || "Course deleted successfully." });
      fetchCourses();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to delete course: " + err.message });
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "32px 16px" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <Link
          to="/admin-dashboard"
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
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dc2626", fontSize: "13px", fontWeight: "700" }}>
              <BookOpen size={16} /> ADMIN COURSE MANAGEMENT
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
              Curriculum & Course Management
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
              Add new elective subjects, select department, modify semester offerings, update faculties, and configure seat quotas.
            </p>
          </div>

          <button
            onClick={openAddModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#16a34a",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              fontWeight: "700",
              fontSize: "14.5px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
            }}
          >
            <PlusCircle size={18} /> Add New Course
          </button>
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

        {/* Filter & Search Bar */}
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
            gap: "14px",
          }}
        >
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", flex: "1 1 280px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0 12px" }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by code, title, faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "none", background: "transparent", outline: "none", fontSize: "13.5px" }}
            />
          </form>

          {/* Department Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                fontWeight: "600",
                background: "white",
                outline: "none",
              }}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                fontWeight: "600",
                background: "white",
                outline: "none",
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

        {/* Courses Table */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          {loading ? (
            <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>
              <Loader size={28} className="spin" style={{ margin: "0 auto 10px", color: "#2563eb" }} />
              <div>Loading courses...</div>
            </div>
          ) : courses.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              No courses found. Click "Add New Course" above to add one.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Code</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Course Name</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Department</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Semester</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Credits</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Faculty In-charge</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600" }}>Available / Total Seats</th>
                    <th style={{ padding: "14px 18px", fontWeight: "600", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 18px" }}>
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
                          {course.courseCode}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{course.courseName}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {course.description || "No description provided"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#2563eb", fontWeight: "600", fontSize: "12.5px" }}>
                        {course.department || "Computer Science & Engineering"}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#334155", fontWeight: "600" }}>
                        Semester {course.semester}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#2563eb", fontWeight: "700" }}>
                        {course.credits} Credits
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>
                        {course.facultyName}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontWeight: "700",
                            color: course.seatsAvailable > 0 ? "#15803d" : "#dc2626",
                          }}
                        >
                          {course.seatsAvailable}
                        </span>
                        <span style={{ color: "#94a3b8" }}> / {course.totalSeats || 60}</span>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            onClick={() => openEditModal(course)}
                            title="Edit course"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              background: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course._id, course.courseName)}
                            title="Delete course"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Add / Edit Course */}
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              zIndex: 200,
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "540px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
              }}
              className="animate-fade"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                  {editingCourse ? "Edit Course Details" : "Add New Elective Course"}
                </h2>
                <button
                  onClick={closeModal}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Course Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS405"
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Course Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mobile Application Dev"
                      value={formData.courseName}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Department Selection */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Offering Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      background: "white",
                      boxSizing: "border-box",
                    }}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Semester (1-8) *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", background: "white", boxSizing: "border-box" }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Credits (1-6) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={6}
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Faculty In-Charge Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Khanna"
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Total Seat Quota *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Seats Available Now *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.seatsAvailable}
                      onChange={(e) => setFormData({ ...formData, seatsAvailable: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Course Description & Syllabus Highlights
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief syllabus outline and key learning outcomes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{ padding: "10px 18px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: "600", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "10px 22px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      fontWeight: "700",
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {submitting ? <Loader size={16} className="spin" /> : <Save size={16} />}
                    {editingCourse ? "Update Course" : "Save Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
