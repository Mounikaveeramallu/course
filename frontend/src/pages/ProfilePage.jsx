import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  User,
  Mail,
  GraduationCap,
  Phone,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    department: "Computer Science",
    semester: 1,
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        department: user.department || "Computer Science",
        semester: user.semester || 1,
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        department: formData.department,
        semester: formData.semester,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const res = await api.updateProfile(payload);
      if (res.success) {
        updateUser(res.user);
        setAlert({ type: "success", text: "Profile information updated successfully!" });
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      }
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 72px)", padding: "36px 16px" }}>
      <div className="container" style={{ maxWidth: "640px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: user?.role === "admin" ? "#fee2e2" : "#eff6ff",
              color: user?.role === "admin" ? "#dc2626" : "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            {user?.role === "admin" ? <Shield size={32} /> : <User size={32} />}
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a" }}>
            {user?.role === "admin" ? "Admin Profile" : "Student Profile"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            Manage your personal academic details and security credentials
          </p>
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

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "32px",
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* Readonly Identity Banner */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ASSIGNED ROLL / USER ID</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                {user?.userId || "N/A"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>REGISTERED EMAIL</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb" }}>
                {user?.email}
              </div>
            </div>
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  background: user?.role === "admin" ? "#fee2e2" : "#dbeafe",
                  color: user?.role === "admin" ? "#b91c1c" : "#1d4ed8",
                  textTransform: "uppercase",
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm">Electronics & Comm</option>
                  <option value="Mechanical Engg">Mechanical Engg</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Academic Affairs">Academic Affairs</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Academic Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "white",
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

            <div>
              <label style={{ display: "block", fontSize: "13.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Change Password Section */}
            <div style={{ marginTop: "12px", paddingTop: "18px", borderTop: "1px dashed #cbd5e1" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
                Update Password (Optional)
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
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
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                marginTop: "12px",
              }}
            >
              {loading ? <Loader size={18} className="spin" /> : <Save size={18} />}
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
