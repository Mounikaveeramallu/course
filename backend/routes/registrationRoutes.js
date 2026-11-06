const express = require("express");
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const Course = require("../models/Course");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// 1. REGISTER FOR COURSE: Module 4 (POST /registerCourse & POST /api/registerCourse)
router.post(["/registerCourse", "/api/registerCourse"], requireAuth, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    // Support both MongoDB _id and custom courseId
    const course = mongoose.Types.ObjectId.isValid(courseId)
      ? await Course.findById(courseId)
      : await Course.findOne({ courseId: courseId.toUpperCase() });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if seats are available
    if (course.seatsAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: `No seats available in ${course.courseName} (${course.courseCode}). Registration closed.`,
      });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      studentId: req.user._id,
      courseId: course._id,
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: `You have already registered for ${course.courseName}. Current status: ${existingReg.approvalStatus}`,
        registration: existingReg,
      });
    }

    // Create registration
    const registration = await Registration.create({
      studentId: req.user._id,
      courseId: course._id,
      registrationDate: new Date(),
      approvalStatus: "Pending", // Awaiting Admin verification
    });

    // Populate for response
    await registration.populate(["courseId", "studentId"]);

    res.status(201).json({
      success: true,
      message: `Registration submitted for ${course.courseName}! Status is Pending admin approval.`,
      registration,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate registration detected" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. VIEW REGISTERED COURSES: Module 5 (GET /myCourses & GET /api/myCourses)
router.get(["/myCourses", "/api/myCourses"], requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = { studentId: req.user._id };

    if (status && status !== "all") {
      query.approvalStatus = status;
    }

    const registrations = await Registration.find(query)
      .populate("courseId")
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. CANCEL REGISTRATION: (DELETE /cancelRegistration/:id & DELETE /api/cancelRegistration/:id)
router.delete(["/cancelRegistration/:id", "/api/cancelRegistration/:id"], requireAuth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    // If student, can only cancel their own registration
    if (req.user.role !== "admin" && registration.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this registration" });
    }

    // If the registration was Approved, restore 1 seat
    if (registration.approvalStatus === "Approved") {
      await Course.findByIdAndUpdate(registration.courseId, {
        $inc: { seatsAvailable: 1 },
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Registration cancelled successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. ADMIN: VIEW ALL STUDENT REGISTRATIONS (GET /allRegistrations & GET /api/allRegistrations)
router.get(["/allRegistrations", "/api/allRegistrations", "/registrations"], requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, courseId, search } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.approvalStatus = status;
    }

    if (courseId && courseId !== "all") {
      query.courseId = courseId;
    }

    const registrations = await Registration.find(query)
      .populate("studentId", "userId name email department semester phone")
      .populate("courseId")
      .sort({ registrationDate: -1 });

    let filtered = registrations;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = registrations.filter((reg) => {
        const student = reg.studentId;
        const course = reg.courseId;
        return (
          (student && (student.name?.toLowerCase().includes(q) || student.email?.toLowerCase().includes(q) || student.userId?.toLowerCase().includes(q))) ||
          (course && (course.courseName?.toLowerCase().includes(q) || course.courseCode?.toLowerCase().includes(q))) ||
          reg.registrationId?.toLowerCase().includes(q)
        );
      });
    }

    res.json({
      success: true,
      count: filtered.length,
      registrations: filtered,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. ADMIN: APPROVE / REJECT COURSE REGISTRATION: (PUT /approveRegistration/:id & PUT /api/approveRegistration/:id)
router.put(["/approveRegistration/:id", "/api/approveRegistration/:id"], requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, adminComments } = req.body; // status: "Approved" | "Rejected" | "Pending"
    const newStatus = status || "Approved";

    if (!["Approved", "Rejected", "Pending"].includes(newStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status. Must be Approved, Rejected, or Pending" });
    }

    const registration = await Registration.findById(req.params.id).populate("courseId");
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    const previousStatus = registration.approvalStatus;

    // Handle seat count transitions
    const course = await Course.findById(registration.courseId._id || registration.courseId);

    if (newStatus === "Approved" && previousStatus !== "Approved") {
      if (course && course.seatsAvailable <= 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot approve: No available seats left for course ${course.courseCode}`,
        });
      }
      if (course) {
        course.seatsAvailable = Math.max(0, course.seatsAvailable - 1);
        if (!course.enrolledStudents.includes(registration.studentId)) {
          course.enrolledStudents.push(registration.studentId);
        }
        await course.save();
      }
    } else if (previousStatus === "Approved" && (newStatus === "Rejected" || newStatus === "Pending")) {
      // Release seat
      if (course) {
        course.seatsAvailable = course.seatsAvailable + 1;
        course.enrolledStudents = course.enrolledStudents.filter(
          (id) => id.toString() !== registration.studentId.toString()
        );
        await course.save();
      }
    }

    registration.approvalStatus = newStatus;
    if (adminComments !== undefined) {
      registration.adminComments = adminComments;
    }
    await registration.save();
    await registration.populate(["studentId", "courseId"]);

    res.json({
      success: true,
      message: `Registration ${registration.registrationId} status updated to ${newStatus}.`,
      registration,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. ENROLLMENT REPORTS & ANALYTICS: (MongoDB Aggregation)
router.get(["/reports/enrollment", "/api/reports/enrollment"], requireAuth, requireAdmin, async (req, res) => {
  try {
    // MongoDB Aggregation #1: Registrations grouped by approvalStatus
    const statusCounts = await Registration.aggregate([
      {
        $group: {
          _id: "$approvalStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // MongoDB Aggregation #2: Registrations grouped by course
    const courseStats = await Registration.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalRegistrations: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$approvalStatus", "Approved"] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$approvalStatus", "Pending"] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$approvalStatus", "Rejected"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          _id: 1,
          courseCode: "$courseInfo.courseCode",
          courseName: "$courseInfo.courseName",
          semester: "$courseInfo.semester",
          totalSeats: "$courseInfo.totalSeats",
          seatsAvailable: "$courseInfo.seatsAvailable",
          totalRegistrations: 1,
          approvedCount: 1,
          pendingCount: 1,
          rejectedCount: 1,
        },
      },
      { $sort: { totalRegistrations: -1 } },
    ]);

    // Summary counts
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRegistrations = await Registration.countDocuments();
    const pendingCount = await Registration.countDocuments({ approvalStatus: "Pending" });
    const approvedCount = await Registration.countDocuments({ approvalStatus: "Approved" });

    res.json({
      success: true,
      summary: {
        totalCourses,
        totalStudents,
        totalRegistrations,
        pendingCount,
        approvedCount,
      },
      statusDistribution: statusCounts,
      courseStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
