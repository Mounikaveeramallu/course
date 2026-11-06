const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
      index: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    adminComments: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations for the same course by the same student
registrationSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Auto-generate registrationId if not provided
registrationSchema.pre("save", function () {
  if (!this.registrationId) {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.registrationId = `REG-${Date.now().toString().slice(-4)}${randomHex}`;
  }
});

module.exports = mongoose.model("Registration", registrationSchema);
