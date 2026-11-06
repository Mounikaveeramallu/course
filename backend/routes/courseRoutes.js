const express = require("express");
const Course = require("../models/Course");
const Registration = require("../models/Registration");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// 1. GET ALL COURSES: (GET /courses & GET /api/courses)
// Supports search filter, semester filter, department filter
router.get(["/courses", "/api/courses"], async (req, res) => {
  try {
    const { semester, department, search } = req.query;
    let filter = {};

    if (semester && semester !== "all") {
      filter.semester = Number(semester);
    }

    if (department && department !== "all") {
      filter.department = { $regex: new RegExp(department.trim(), "i") };
    }

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { courseName: regex },
        { courseCode: regex },
        { facultyName: regex },
        { courseId: regex },
        { department: regex },
      ];
    }

    const courses = await Course.find(filter).sort({ semester: 1, courseCode: 1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET SINGLE COURSE BY ID: (GET /courses/:id & GET /api/courses/:id)
router.get(["/courses/:id", "/api/courses/:id"], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. CREATE COURSE: Module 3 Admin (POST /courses & POST /api/courses)
router.post(["/courses", "/api/courses"], requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      courseId,
      courseCode,
      courseName,
      department,
      semester,
      facultyName,
      credits,
      seatsAvailable,
      totalSeats,
      description,
    } = req.body;

    if (!courseCode || !courseName || !semester || !facultyName || !credits || seatsAvailable === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide courseCode, courseName, semester, facultyName, credits, and seatsAvailable",
      });
    }

    // Auto-generate courseId if missing
    const finalCourseId = courseId || courseCode.toUpperCase().replace(/\s+/g, "");

    const existingCourse = await Course.findOne({
      $or: [{ courseId: finalCourseId }, { courseCode: courseCode.trim() }],
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: `Course with Code ${courseCode} or ID ${finalCourseId} already exists`,
      });
    }

    const course = await Course.create({
      courseId: finalCourseId,
      courseCode: courseCode.trim(),
      courseName: courseName.trim(),
      department: department ? department.trim() : "Computer Science & Engineering",
      semester: Number(semester),
      facultyName: facultyName.trim(),
      credits: Number(credits),
      seatsAvailable: Number(seatsAvailable),
      totalSeats: totalSeats ? Number(totalSeats) : Number(seatsAvailable),
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: `Course '${course.courseName}' created successfully!`,
      course,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. UPDATE COURSE: Module 3 Admin (PUT /courses/:id & PUT /api/courses/:id)
router.put(["/courses/:id", "/api/courses/:id"], requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      department,
      semester,
      facultyName,
      credits,
      seatsAvailable,
      totalSeats,
      description,
    } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (courseCode) course.courseCode = courseCode.trim();
    if (courseName) course.courseName = courseName.trim();
    if (department) course.department = department.trim();
    if (semester !== undefined) course.semester = Number(semester);
    if (facultyName) course.facultyName = facultyName.trim();
    if (credits !== undefined) course.credits = Number(credits);
    if (seatsAvailable !== undefined) course.seatsAvailable = Number(seatsAvailable);
    if (totalSeats !== undefined) course.totalSeats = Number(totalSeats);
    if (description !== undefined) course.description = description;

    await course.save();

    res.json({
      success: true,
      message: `Course '${course.courseName}' updated successfully!`,
      course,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. DELETE COURSE: Module 3 Admin (DELETE /courses/:id & DELETE /api/courses/:id)
router.delete(["/courses/:id", "/api/courses/:id"], requireAuth, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Delete associated registrations or notify
    await Registration.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Course '${course.courseName}' and related registrations deleted successfully.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
