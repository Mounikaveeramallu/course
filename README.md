# Course Registration Portal (MERN Stack Mini Project)
> **Inspired by SIH 2025 – Smart Curriculum Activity & Attendance App**  
> Built for **ABC Engineering College**

---

## 1. Problem Statement
ABC Engineering College offers several elective and skill-oriented courses every semester. Currently, students register for these courses by filling Google Forms or paper applications. Managing registrations manually often leads to duplicate entries, incorrect course allocation, and difficulty in generating enrollment reports.

This **Mini MERN Stack Application** provides a centralized digital portal where students can register for available elective courses and college administrators can manage curriculum offerings, verify prerequisites, and approve student registrations in real time.

---

## 2. Why Develop this Project?
- **Learn MERN Stack Application Development**: Hands-on integration between MongoDB, Express.js, React, and Node.js.
- **Understand CRUD Operations**: Create, read, update, and delete courses and registrations.
- **Practice Authentication & Authorization**: Secure password hashing with `bcryptjs`, session handling via JSON Web Tokens (`JWT`), and role-based route guards.
- **Learn REST API Development**: Clean API architecture following standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Manage Course Registrations Digitally**: Real-time quota enforcement, duplicate prevention, and approval workflows.
- **Understand React Components & Routing**: Modular React components, hooks (`useState`, `useEffect`), context state management, and multi-page routing with `react-router-dom`.

---

## 3. User Roles

### **Admin**
- **Login**: Secure administrative access with elevated privileges.
- **Add New Courses**: Create new course offerings with faculty in-charge, semester, credits, and seat limits.
- **Edit Course Details**: Modify course title, faculty, credits, and seat quotas on the fly.
- **Delete Courses**: Remove obsolete courses with automated cleanup of associated registrations.
- **View Student Registrations**: Comprehensive list of student enrollment applications across departments.
- **Approve / Reject Course Registrations**: 1-click verification of student requests with automated seat tracking.
- **Enrollment Reports**: View real-time aggregated metrics and occupancy charts powered by MongoDB `aggregate()`.

### **Student**
- **Register**: Create a student profile with Roll/User ID, Department, and Academic Semester.
- **Login**: Sign in securely to access student portal features.
- **View Available Courses**: Browse full elective catalog with live search and semester filtering.
- **Register for Courses**: Dedicated registration workflow with seat availability checks and declaration confirmation.
- **View Registered Courses**: Track live status (`Pending`, `Approved`, `Rejected`), credits earned, and faculty details.
- **Cancel Registration**: Self-service cancellation that safely restores course seat quotas.
- **Update Profile**: Update student contact information, department, semester, and password.

---

## 4. Modules Implemented
| Module | Name | Description |
|---|---|---|
| **Module 1** | **Student Registration** | Sign-up with name, email, roll ID, department, semester, and password. |
| **Module 2** | **Login Authentication** | JWT-based authentication for both Student and Admin roles with demo shortcuts. |
| **Module 3** | **Course Management** | Complete CRUD operations for Administrators to manage elective curriculum. |
| **Module 4** | **Course Registration** | Dedicated workflow for students to review course details and submit registration. |
| **Module 5** | **Registered Course List** | Student's active registrations with live status badges (`Pending`, `Approved`, `Rejected`). |
| **Module 6** | **Student Dashboard** | Central dashboard with student stats, credit totals, quick actions, and recent registrations. |
| **Module 7** | **Admin Dashboard** | High-level college metrics, registration review table, and MongoDB aggregation reports. |

---

## 5. Technology Stack
- **Frontend**: ReactJS (Vite), React Router v7, Lucide Icons, Pure Responsive CSS
- **Backend**: NodeJS, ExpressJS, JWT, bcryptjs, CORS, Dotenv
- **Database**: MongoDB (Atlas or Local MongoDB Server), Mongoose ODM
- **API Testing**: Postman & Built-in Automated Test Script (`test_portal_api.js`)

---

## 6. MongoDB Collections & Schemas

### Collection 1: `users`
```javascript
{
  userId: String,         // e.g. "STU2025101" or "ADM2025001"
  name: String,           // Full student or admin name
  email: String,          // Unique login email
  password: String,       // Hashed with bcryptjs (cost factor 12)
  role: String,           // "student" | "admin"
  department: String,     // e.g. "Computer Science"
  semester: Number,       // 1 to 8
  phone: String,          // Optional contact number
  timestamps: true
}
```

### Collection 2: `courses`
```javascript
{
  courseId: String,       // e.g. "CS201"
  courseCode: String,     // e.g. "CS201"
  courseName: String,     // e.g. "Data Structures & Algorithms"
  semester: Number,       // 1 to 8
  facultyName: String,    // e.g. "Dr. Meera Iyer"
  credits: Number,        // 1 to 6
  seatsAvailable: Number, // Current remaining seats
  totalSeats: Number,     // Total seat quota (default 60)
  description: String,    // Syllabus and course details
  timestamps: true
}
```

### Collection 3: `registrations`
```javascript
{
  registrationId: String, // Unique generated ID (e.g. "REG-2025001")
  studentId: ObjectId,    // References 'User'
  courseId: ObjectId,     // References 'Course'
  registrationDate: Date, // Timestamp of registration
  approvalStatus: String, // "Pending" | "Approved" | "Rejected"
  adminComments: String,  // Verification remarks from admin
  timestamps: true
}
// Unique compound index on { studentId: 1, courseId: 1 } prevents duplicate entries.
```

---

## 7. REST APIs Reference

### Authentication
- `POST /register` — Register new student account (Module 1)
- `POST /login` — Authenticate student or admin and return JWT (Module 2)
- `GET  /profile` — Fetch current user profile
- `PUT  /profile` — Update user profile details and password

### Courses (Module 3)
- `GET    /courses` — View available courses (supports `?semester=...&search=...`)
- `GET    /courses/:id` — View details of a specific course
- `POST   /courses` — **Admin**: Add new course offering
- `PUT    /courses/:id` — **Admin**: Edit course details and seats
- `DELETE /courses/:id` — **Admin**: Delete course offering

### Registrations (Modules 4 & 5)
- `POST   /registerCourse` — **Student**: Register for an elective course
- `GET    /myCourses` — **Student**: View registered courses with approval status
- `DELETE /cancelRegistration/:id` — Cancel registration and restore course seat
- `GET    /allRegistrations` — **Admin**: View all student registrations across college
- `PUT    /approveRegistration/:id` — **Admin**: Approve or reject registration
- `GET    /reports/enrollment` — **Admin**: Aggregated enrollment analytics (MongoDB `aggregate()`)

---

## 8. React Pages Structure
- `/` — **Home Page**: College banner, SIH 2025 highlights, user role capabilities, and 1-click demo logins.
- `/register` — **Register Page**: Student sign-up with department, semester, and roll ID.
- `/login` — **Login Page**: Role-based authentication with 1-click test credentials.
- `/student-dashboard` — **Student Dashboard**: Overview metrics, credit counts, and registrations table.
- `/courses` — **Course List**: Searchable and filterable course catalog with seat availability badges.
- `/register-course` — **Register Course**: Detailed registration form with prerequisite declaration.
- `/my-courses` — **My Courses**: Enrolled courses list with status filters (`Pending`, `Approved`, `Rejected`).
- `/admin-dashboard` — **Admin Dashboard**: Verification portal with 1-click approve/reject and enrollment charts.
- `/manage-courses` — **Manage Courses**: CRUD management interface for course offerings.
- `/profile` — **Update Profile**: Update student contact details and credentials.

---

## 9. Demo Login Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Student** | `student@abc.edu` | `student123` | Student Dashboard, Register Course, My Courses |
| **Admin** | `admin@abc.edu` | `admin123` | Admin Dashboard, Manage Courses, Approvals, Reports |

*(1-click demo buttons are also provided directly on the Login page and Home page!)*

---

## 10. How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI in `backend/.env`.

### Step 1: Backend Setup
```bash
cd backend
npm install
node seed.js         # Populates sample courses, admin, and student accounts
npm run dev          # Starts backend on http://localhost:5000
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server on http://localhost:5173
```

### Step 3: Run Automated REST API Verification
```bash
cd backend
node test_portal_api.js
```
