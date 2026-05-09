const Admin = require("../models/Admin");
const Institute = require("../models/Institute");
const Batch = require("../models/Batch");
const Student = require("../models/Student");
const Exam = require("../models/Exam");
const Result = require("../models/Result");

const generateToken = require("../utils/generateToken");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin username or password",
      });
    }

    res.json({
      success: true,
      token: generateToken(admin._id, "admin"),
      admin: {
        _id: admin._id,
        name: admin.name,
        username: admin.username,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const institutes = await Institute.countDocuments();
    const batches = await Batch.countDocuments();
    const students = await Student.countDocuments();
    const exams = await Exam.countDocuments();

    // Agar Exam model me isPublished field hai
    const publishedExams = await Exam.countDocuments({
      isPublished: true,
    });

    // Agar Result model me status field hai
    const pendingResults = await Result.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      data: {
        institutes,
        batches,
        students,
        exams,
        publishedExams,
        pendingResults,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminDashboardStats,
};