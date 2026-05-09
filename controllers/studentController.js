// const Student = require("../models/Student");
// const generateToken = require("../utils/generateToken");

// const createStudent = async (req, res) => {
//   try {
//     const photo = req.file ? `/uploads/students/${req.file.filename}` : "";

//     const student = await Student.create({
//       ...req.body,
//       photo,
//     });

//     res.status(201).json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getStudents = async (req, res) => {
//   try {
//     const students = await Student.find()
//       .select("-password")
//       .populate("institute", "name code")
//       .populate("batch", "name courseName")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: students,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getStudentById = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id)
//       .select("-password")
//       .populate("institute", "name code")
//       .populate("batch", "name courseName");

//     res.json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateStudent = async (req, res) => {
//   try {
//     const data = { ...req.body };

//     if (req.file) {
//       data.photo = `/uploads/students/${req.file.filename}`;
//     }

//     delete data.password;

//     const student = await Student.findByIdAndUpdate(req.params.id, data, {
//       new: true,
//     }).select("-password");

//     res.json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deleteStudent = async (req, res) => {
//   try {
//     await Student.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Student deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const loginStudent = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const student = await Student.findOne({ username });

//     if (!student || !(await student.matchPassword(password))) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid student username or password",
//       });
//     }

//     if (!student.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Student account blocked",
//       });
//     }

//     res.json({
//       success: true,
//       token: generateToken(student._id, "student"),
//       student: {
//         _id: student._id,
//         name: student.name,
//         username: student.username,
//         rollNumber: student.rollNumber,
//         registrationNumber: student.registrationNumber,
//         mobileNumber: student.mobileNumber,
//         institute: student.institute,
//         batch: student.batch,
//         role: "student",
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getStudentProfile = async (req, res) => {
//   try {
//     const student = await Student.findById(req.user._id)
//       .select("-password")
//       .populate("institute", "name code")
//       .populate("batch", "name courseName");

//     res.json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   createStudent,
//   getStudents,
//   getStudentById,
//   updateStudent,
//   deleteStudent,
//   loginStudent,
//   getStudentProfile,
// };




const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");

const createStudent = async (req, res) => {
  try {
    const photo = req.file ? `/uploads/students/${req.file.filename}` : "";

    const student = await Student.create({
      ...req.body,
      photo,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
    res.status(500).json({
      success: false,
      message: error.message,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.photo = `/uploads/students/${req.file.filename}`;
    }

    // Edit ke time password ko update nahi kar rahe
    delete data.password;

    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).select("-password");

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
    res.status(500).json({
      success: false,
      message: error.message,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    const student = await Student.findOne({ username });

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
        institute: student.institute,
        batch: student.batch,
        role: "student",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
    res.status(500).json({
      success: false,
      message: error.message,
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