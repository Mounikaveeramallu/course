
const BASE_URL = "https://course-kqdu.vercel.app".replace(/\/+$/, "");

const getHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.message || `Request failed with status ${res.status}`
    );
  }

  return data;
};

export const api = {
  // Auth
  login: async (email, password, role) => {
    const payload = { email, password };
    if (role) payload.role = role;

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/profile`, {
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });

    return handleResponse(res);
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return handleResponse(res);
  },

  resetPassword: async (token, password) => {
    const res = await fetch(`${BASE_URL}/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    return handleResponse(res);
  },

  // Courses
  getCourses: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.semester && filters.semester !== "all")
      params.append("semester", filters.semester);

    if (filters.department && filters.department !== "all")
      params.append("department", filters.department);

    if (filters.search)
      params.append("search", filters.search);

    const queryString = params.toString()
      ? `?${params.toString()}`
      : "";

    const res = await fetch(`${BASE_URL}/courses${queryString}`);

    return handleResponse(res);
  },

  getCourseById: async (id) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`);

    return handleResponse(res);
  },

  createCourse: async (courseData) => {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(courseData),
    });

    return handleResponse(res);
  },

  updateCourse: async (id, courseData) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(courseData),
    });

    return handleResponse(res);
  },

  deleteCourse: async (id) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  // Registrations
  registerCourse: async (courseId) => {
    const res = await fetch(`${BASE_URL}/registerCourse`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ courseId }),
    });

    return handleResponse(res);
  },

  getMyCourses: async (status = "all") => {
    const query =
      status && status !== "all"
        ? `?status=${encodeURIComponent(status)}`
        : "";

    const res = await fetch(`${BASE_URL}/myCourses${query}`, {
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  cancelRegistration: async (registrationId) => {
    const res = await fetch(
      `${BASE_URL}/cancelRegistration/${registrationId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    return handleResponse(res);
  },

  getAllRegistrations: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.status && filters.status !== "all")
      params.append("status", filters.status);

    if (filters.courseId && filters.courseId !== "all")
      params.append("courseId", filters.courseId);

    if (filters.search)
      params.append("search", filters.search);

    const queryString = params.toString()
      ? `?${params.toString()}`
      : "";

    const res = await fetch(
      `${BASE_URL}/allRegistrations${queryString}`,
      {
        headers: getHeaders(),
      }
    );

    return handleResponse(res);
  },

  approveRegistration: async (
    registrationId,
    status = "Approved",
    adminComments = ""
  ) => {
    const res = await fetch(
      `${BASE_URL}/approveRegistration/${registrationId}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status, adminComments }),
      }
    );

    return handleResponse(res);
  },

  getEnrollmentReports: async () => {
    const res = await fetch(`${BASE_URL}/reports/enrollment`, {
      headers: getHeaders(),
    });

    return handleResponse(res);
  },
};
