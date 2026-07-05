// const Exam = require("../models/Exam");
// const Submission = require("../models/Submission");

// const createExam = async (req, res) => {
//   try {
//     const exam = await Exam.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: exam,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getExams = async (req, res) => {
//   try {
//     const exams = await Exam.find()
//       .populate("institute", "name code")
//       .populate("batch", "name courseName")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: exams,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getExamById = async (req, res) => {
//   try {
//     const exam = await Exam.findById(req.params.id)
//       .populate("institute", "name code")
//       .populate("batch", "name courseName");

//     res.json({
//       success: true,
//       data: exam,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateExam = async (req, res) => {
//   try {
//     const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     res.json({
//       success: true,
//       data: exam,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deleteExam = async (req, res) => {
//   try {
//     await Exam.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Exam deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const publishExam = async (req, res) => {
//   try {
//     const exam = await Exam.findByIdAndUpdate(
//       req.params.id,
//       {
//         isPublished: true,
//         status: "published",
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: exam,
//       message: "Exam published successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const unpublishExam = async (req, res) => {
//   try {
//     const exam = await Exam.findByIdAndUpdate(
//       req.params.id,
//       {
//         isPublished: false,
//         status: "draft",
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: exam,
//       message: "Exam unpublished successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const releaseResult = async (req, res) => {
//   try {
//     const { resultPublishDate, resultVisibleTill } = req.body;

//     const exam = await Exam.findByIdAndUpdate(
//       req.params.id,
//       {
//         resultReleased: true,
//         resultPublishDate: resultPublishDate || new Date(),
//         resultVisibleTill:
//           resultVisibleTill ||
//           new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: exam,
//       message: "Result released successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const hideResult = async (req, res) => {
//   try {
//     const exam = await Exam.findByIdAndUpdate(
//       req.params.id,
//       {
//         resultReleased: false,
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: exam,
//       message: "Result hidden successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getAvailableExams = async (req, res) => {
//   try {
//     const now = new Date();

//     console.log("Student institute:", req.user.institute);
//     console.log("Student batch:", req.user.batch);
//     console.log("Current time:", now);

//     const submissions = await Submission.find({
//       student: req.user._id,
//     }).select("exam");

//     const submittedExamIds = submissions.map((s) => s.exam);

//     const allPublishedExams = await Exam.find({
//       isPublished: true,
//     })
//       .populate("institute", "name code")
//       .populate("batch", "name courseName");

//     console.log("All Published Exams Count:", allPublishedExams.length);

//     allPublishedExams.forEach((exam) => {
//       console.log("Exam Debug:", {
//         title: exam.title,
//         examInstituteId: exam.institute?._id,
//         examBatchId: exam.batch?._id,
//         studentInstituteId: req.user.institute,
//         studentBatchId: req.user.batch,
//         isPublished: exam.isPublished,
//         status: exam.status,
//         startTime: exam.startTime,
//         endTime: exam.endTime,
//         now,
//       });
//     });

//     const exams = await Exam.find({
//       institute: req.user.institute,
//       batch: req.user.batch,
//       isPublished: true,
//       startTime: { $lte: now },
//       endTime: { $gte: now },
//       _id: { $nin: submittedExamIds },
//     }).select("-questions.correctAnswerIndex");

//     console.log("Available exams:", exams);

//     res.json({
//       success: true,
//       data: exams,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getUpcomingExams = async (req, res) => {
//   try {
//     const now = new Date();

//     const exams = await Exam.find({
//       institute: req.user.institute,
//       batch: req.user.batch,
//       isPublished: true,
//       startTime: { $gt: now },
//     }).select("-questions.correctAnswerIndex");

//     res.json({
//       success: true,
//       data: exams,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getCompletedExams = async (req, res) => {
//   try {
//     const submissions = await Submission.find({
//       student: req.user._id,
//     }).populate("exam", "title totalMarks duration startTime endTime");

//     res.json({
//       success: true,
//       data: submissions,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// const getStudentExamById = async (req, res) => {
//   try {
//     const now = new Date();

//     const exam = await Exam.findOne({
//       _id: req.params.examId,
//       institute: req.user.institute,
//       batch: req.user.batch,
//       isPublished: true,
//       startTime: { $lte: now },
//       endTime: { $gte: now },
//     }).select("-questions.correctAnswerIndex");

//     if (!exam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not available right now",
//       });
//     }

//     res.json({
//       success: true,
//       data: exam,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   createExam,
//   getExams,
//   getExamById,
//   updateExam,
//   deleteExam,
//   publishExam,
//   unpublishExam,
//   releaseResult,
//   hideResult,
//   getAvailableExams,
//   getUpcomingExams,
//   getCompletedExams,
//   getStudentExamById,
// };





const Exam = require("../models/Exam");
const Submission = require("../models/Submission");

const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);

    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("institute", "name code logo address") // ✅ Updated: logo & address added
      .populate("batch", "name courseName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("institute", "name code logo address") // ✅ Updated: logo & address added
      .populate("batch", "name courseName");

    res.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        isPublished: true,
        status: "published",
      },
      { new: true }
    );

    res.json({
      success: true,
      data: exam,
      message: "Exam published successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unpublishExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        isPublished: false,
        status: "draft",
      },
      { new: true }
    );

    res.json({
      success: true,
      data: exam,
      message: "Exam unpublished successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const releaseResult = async (req, res) => {
  try {
    const { resultPublishDate, resultVisibleTill } = req.body;

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        resultReleased: true,
        resultPublishDate: resultPublishDate || new Date(),
        resultVisibleTill:
          resultVisibleTill ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: exam,
      message: "Result released successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const hideResult = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        resultReleased: false,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: exam,
      message: "Result hidden successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAvailableExams = async (req, res) => {
  try {
    const now = new Date();

    console.log("Student institute:", req.user.institute);
    console.log("Student batch:", req.user.batch);
    console.log("Current time:", now);

    const submissions = await Submission.find({
      student: req.user._id,
    }).select("exam");

    const submittedExamIds = submissions.map((s) => s.exam);

    const allPublishedExams = await Exam.find({
      isPublished: true,
    })
      .populate("institute", "name code logo address") // ✅ Updated: logo & address added
      .populate("batch", "name courseName");

    console.log("All Published Exams Count:", allPublishedExams.length);

    allPublishedExams.forEach((exam) => {
      console.log("Exam Debug:", {
        title: exam.title,
        examInstituteId: exam.institute?._id,
        examBatchId: exam.batch?._id,
        studentInstituteId: req.user.institute,
        studentBatchId: req.user.batch,
        isPublished: exam.isPublished,
        status: exam.status,
        startTime: exam.startTime,
        endTime: exam.endTime,
        now,
      });
    });

    const exams = await Exam.find({
      institute: req.user.institute,
      batch: req.user.batch,
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
      _id: { $nin: submittedExamIds },
    })
      .select("-questions.correctAnswerIndex")
      .populate("institute", "name code logo address") // ✅ Added: populate institute
      .populate("batch", "name courseName"); // ✅ Added: populate batch

    console.log("Available exams:", exams);

    res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUpcomingExams = async (req, res) => {
  try {
    const now = new Date();

    const exams = await Exam.find({
      institute: req.user.institute,
      batch: req.user.batch,
      isPublished: true,
      startTime: { $gt: now },
    })
      .select("-questions.correctAnswerIndex")
      .populate("institute", "name code logo address") // ✅ Added: populate institute
      .populate("batch", "name courseName"); // ✅ Added: populate batch

    res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompletedExams = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user._id,
    }).populate("exam", "title totalMarks duration startTime endTime");

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getStudentExamById = async (req, res) => {
  try {
    const now = new Date();

    const exam = await Exam.findOne({
      _id: req.params.examId,
      institute: req.user.institute,
      batch: req.user.batch,
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .select("-questions.correctAnswerIndex")
      .populate("institute", "name code logo address") // ✅ Added: populate institute
      .populate("batch", "name courseName"); // ✅ Added: populate batch

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not available right now",
      });
    }

    res.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  unpublishExam,
  releaseResult,
  hideResult,
  getAvailableExams,
  getUpcomingExams,
  getCompletedExams,
  getStudentExamById,
};