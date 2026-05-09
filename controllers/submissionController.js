const Exam = require("../models/Exam");
const Submission = require("../models/Submission");
const Result = require("../models/Result");
const calculateResult = require("../utils/calculateResult");

const submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const { examId } = req.params;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const now = new Date();

    if (now < new Date(exam.startTime)) {
      return res.status(400).json({
        success: false,
        message: "Exam has not started yet",
      });
    }

    if (now > new Date(exam.endTime)) {
      return res.status(400).json({
        success: false,
        message: "Exam time is over",
      });
    }

    const alreadySubmitted = await Submission.findOne({
      student: req.user._id,
      exam: examId,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this exam",
      });
    }

    const resultData = calculateResult(exam, answers || []);

    const submission = await Submission.create({
      student: req.user._id,
      exam: examId,
      answers: resultData.checkedAnswers,
      totalMarks: exam.totalMarks,
      obtainedMarks: resultData.obtainedMarks,
      correctCount: resultData.correctCount,
      wrongCount: resultData.wrongCount,
      attemptedCount: resultData.attemptedCount,
      unattemptedCount: resultData.unattemptedCount,
    });

    const percentage =
      exam.totalMarks > 0
        ? Number(((resultData.obtainedMarks / exam.totalMarks) * 100).toFixed(2))
        : 0;

    await Result.create({
      student: req.user._id,
      exam: examId,
      submission: submission._id,
      totalMarks: exam.totalMarks,
      obtainedMarks: resultData.obtainedMarks,
      percentage,
      resultStatus: percentage >= 33 ? "pass" : "fail",
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: "Exam submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitExam };