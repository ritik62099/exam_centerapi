

const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");

const createStudent = async (req, res) => {
  try {
    const photo = req.file ? req.file.path : "";

    const student = await Student.create({
      ...req.body,
      photo,
    });

    const studentData = await Student.findById(student._id)
      .select("-password")
      .populate("institute", "name code")
      .populate("batch", "name courseName");

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentData,
    });
  } catch (error) {
    console.log("Create student error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Student create nahi ho paya",
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .populate("institute", "name code")
      .populate("batch", "name courseName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.log("Get students error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Students fetch nahi ho paye",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate("institute", "name code")
      .populate("batch", "name courseName");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log("Get student by id error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Student detail fetch nahi ho paya",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.photo = req.file.path;
    }

    // Edit ke time blank password update nahi karna
    if (!data.password || data.password.trim() === "") {
      delete data.password;
    }

    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("institute", "name code")
      .populate("batch", "name courseName");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.log("Update student error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Student update nahi ho paya",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log("Delete student error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Student delete nahi ho paya",
    });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    const student = await Student.findOne({ username })
      .populate("institute", "name code")
      .populate("batch", "name courseName");

    if (!student || !(await student.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid student username or password",
      });
    }

    if (!student.isActive) {
      return res.status(403).json({
        success: false,
        message: "Student account blocked",
      });
    }

    res.json({
      success: true,
      token: generateToken(student._id, "student"),
      student: {
        _id: student._id,
        name: student.name,
        username: student.username,
        rollNumber: student.rollNumber,
        registrationNumber: student.registrationNumber,
        mobileNumber: student.mobileNumber,
        photo: student.photo,
        institute: student.institute,
        batch: student.batch,
        role: "student",
      },
    });
  } catch (error) {
    console.log("Student login error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Student login nahi ho paya",
    });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select("-password")
      .populate("institute", "name code")
      .populate("batch", "name courseName");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log("Student profile error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Student profile fetch nahi ho paya",
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent,
  getStudentProfile,
};