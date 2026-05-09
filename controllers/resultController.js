// const Result = require("../models/Result");
// const Exam = require("../models/Exam");
// const generateResultPdf = require("../utils/generateResultPdf");

// const getExamResults = async (req, res) => {
//   try {
//     const results = await Result.find({ exam: req.params.examId })
//       .populate(
//         "student",
//         "name rollNumber registrationNumber mobileNumber username"
//       )
//       .populate({
//         path: "exam",
//         populate: [
//           {
//             path: "institute",
//             select: "name code address",
//           },
//           {
//             path: "batch",
//             select: "name courseName",
//           },
//         ],
//       })
//       .populate("submission");

//     res.json({
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getStudentResultsByAdmin = async (req, res) => {
//   try {
//     const results = await Result.find({ student: req.params.studentId })
//       .populate("student", "name rollNumber registrationNumber")
//       .populate("exam", "title totalMarks");

//     res.json({
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getMyResults = async (req, res) => {
//   try {
//     const now = new Date();

//     const results = await Result.find({ student: req.user._id })
//       .populate({
//         path: "exam",
//         match: {
//           resultReleased: true,
//           resultPublishDate: { $lte: now },
//           resultVisibleTill: { $gte: now },
//         },
//         select: "title totalMarks resultReleased resultPublishDate resultVisibleTill",
//       })
//       .populate("student", "name rollNumber registrationNumber");

//     const filteredResults = results.filter((result) => result.exam !== null);

//     res.json({
//       success: true,
//       data: filteredResults,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getMyResultDetails = async (req, res) => {
//   try {
//     const now = new Date();

//     const exam = await Exam.findOne({
//       _id: req.params.examId,
//       resultReleased: true,
//       resultPublishDate: { $lte: now },
//       resultVisibleTill: { $gte: now },
//     });

//     if (!exam) {
//       return res.status(403).json({
//         success: false,
//         message: "Result is not released yet",
//       });
//     }

//     const result = await Result.findOne({
//       student: req.user._id,
//       exam: req.params.examId,
//     })
//       .populate("student", "name rollNumber registrationNumber mobileNumber")
//       .populate({
//         path: "exam",
//         populate: [
//           {
//             path: "institute",
//             select: "name code address",
//           },
//           {
//             path: "batch",
//             select: "name courseName",
//           },
//         ],
//       })
//       .populate("submission");

//     res.json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const downloadMyResultPdf = async (req, res) => {
//   try {
//     const now = new Date();

//     const resultId = req.params.resultId || req.params.id;

//     console.log("PDF Result ID:", resultId);

//     const result = await Result.findOne({
//       _id: resultId,
//       student: req.user._id,
//     })
//       .populate("student", "name rollNumber registrationNumber mobileNumber username")
//       .populate({
//         path: "exam",
//         populate: [
//           {
//             path: "institute",
//             select: "name code address",
//           },
//           {
//             path: "batch",
//             select: "name courseName",
//           },
//         ],
//       });

//     if (!result) {
//       return res.status(404).json({
//         success: false,
//         message: "Result not found",
//       });
//     }

//     const exam = result.exam;

//     if (!exam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found in result",
//       });
//     }

//     if (
//       !exam.resultReleased ||
//       exam.resultPublishDate > now ||
//       exam.resultVisibleTill < now
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Result is not released yet",
//       });
//     }

//     return generateResultPdf(res, result);
//   } catch (error) {
//     console.error("PDF download error:", error);

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: error.message || "PDF generate karne me error aaya",
//       });
//     }
//   }
// };

// module.exports = {
//   getExamResults,
//   getStudentResultsByAdmin,
//   getMyResults,
//   getMyResultDetails,
//   downloadMyResultPdf,
// };




const Result = require("../models/Result");
const Exam = require("../models/Exam");
const generateResultPdf = require("../utils/generateResultPdf");

const getExamResults = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate(
        "student",
        "name rollNumber registrationNumber mobileNumber username"
      )
      .populate({
        path: "exam",
        populate: [
          {
            path: "institute",
            select: "name code address",
          },
          {
            path: "batch",
            select: "name courseName",
          },
        ],
      });

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentResultsByAdmin = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate("student", "name rollNumber registrationNumber")
      .populate("exam", "title totalMarks");

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const now = new Date();

    const results = await Result.find({ student: req.user._id })
      .populate({
        path: "exam",
        match: {
          resultReleased: true,
          resultPublishDate: { $lte: now },
          resultVisibleTill: { $gte: now },
        },
        select:
          "title totalMarks resultReleased resultPublishDate resultVisibleTill",
      })
      .populate("student", "name rollNumber registrationNumber");

    const filteredResults = results.filter((result) => result.exam !== null);

    res.json({
      success: true,
      data: filteredResults,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyResultDetails = async (req, res) => {
  try {
    const now = new Date();

    const exam = await Exam.findOne({
      _id: req.params.examId,
      resultReleased: true,
      resultPublishDate: { $lte: now },
      resultVisibleTill: { $gte: now },
    });

    if (!exam) {
      return res.status(403).json({
        success: false,
        message: "Result is not released yet",
      });
    }

    const result = await Result.findOne({
      student: req.user._id,
      exam: req.params.examId,
    })
      .populate("student", "name rollNumber registrationNumber mobileNumber")
      .populate({
        path: "exam",
        populate: [
          {
            path: "institute",
            select: "name code address",
          },
          {
            path: "batch",
            select: "name courseName",
          },
        ],
      });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const downloadMyResultPdf = async (req, res) => {
  try {
    const now = new Date();

    const resultId = req.params.resultId;
    const studentId = req.user?._id || req.user?.id;

    console.log("PDF Result ID:", resultId);
    console.log("Logged Student ID:", studentId);

    if (!resultId) {
      return res.status(400).json({
        success: false,
        message: "Result ID missing in URL",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student ID missing from token",
      });
    }

    const result = await Result.findById(resultId)
      .populate(
        "student",
        "name rollNumber registrationNumber mobileNumber username"
      )
      .populate({
        path: "exam",
        populate: [
          {
            path: "institute",
            select: "name code address",
          },
          {
            path: "batch",
            select: "name courseName",
          },
        ],
      });

    console.log("Result Found:", result ? "YES" : "NO");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found with this result ID",
      });
    }

    const resultStudentId =
      result.student?._id?.toString?.() || result.student?.toString?.();

    console.log("Result Student ID:", resultStudentId);

    if (resultStudentId !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to download this result",
      });
    }

    const exam = result.exam;

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found in result",
      });
    }

    if (
      !exam.resultReleased ||
      new Date(exam.resultPublishDate) > now ||
      new Date(exam.resultVisibleTill) < now
    ) {
      return res.status(403).json({
        success: false,
        message: "Result is not released yet",
      });
    }

    return generateResultPdf(res, result);
  } catch (error) {
    console.error("PDF download error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message || "PDF generate karne me error aaya",
      });
    }
  }
};

module.exports = {
  getExamResults,
  getStudentResultsByAdmin,
  getMyResults,
  getMyResultDetails,
  downloadMyResultPdf,
};