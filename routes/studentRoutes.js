const express = require("express");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent,
  getStudentProfile,
} = require("../controllers/studentController");

const {
  getAvailableExams,
  getUpcomingExams,
  getCompletedExams,
  getStudentExamById,
} = require("../controllers/examController");

const { submitExam } = require("../controllers/submissionController");

const {
  getMyResults,
  getMyResultDetails,
  downloadMyResultPdf,
} = require("../controllers/resultController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/* ================= STUDENT AUTH ================= */

router.post("/login", loginStudent);

router.get("/profile", protect, allowRoles("student"), getStudentProfile);

/* ================= STUDENT EXAMS ================= */

router.get(
  "/exams/available",
  protect,
  allowRoles("student"),
  getAvailableExams
);

router.get(
  "/exams/upcoming",
  protect,
  allowRoles("student"),
  getUpcomingExams
);

router.get(
  "/exams/completed",
  protect,
  allowRoles("student"),
  getCompletedExams
);

router.get(
  "/exams/:examId",
  protect,
  allowRoles("student"),
  getStudentExamById
);

router.post(
  "/exams/:examId/submit",
  protect,
  allowRoles("student"),
  submitExam
);

/* ================= STUDENT RESULTS ================= */

// My released results list
router.get(
  "/results",
  protect,
  allowRoles("student"),
  getMyResults
);

// PDF download by resultId
// URL: /api/students/results/:resultId/pdf
router.get(
  "/results/:resultId/pdf",
  protect,
  allowRoles("student"),
  downloadMyResultPdf
);

// Result details by examId
// URL: /api/students/results/:examId
router.get(
  "/results/:examId",
  protect,
  allowRoles("student"),
  getMyResultDetails
);

/* ================= ADMIN STUDENT CRUD ================= */

router
  .route("/")
  .get(protect, allowRoles("admin"), getStudents)
  .post(protect, allowRoles("admin"), upload.single("photo"), createStudent);

router
  .route("/:id")
  .get(protect, allowRoles("admin"), getStudentById)
  .put(protect, allowRoles("admin"), upload.single("photo"), updateStudent)
  .delete(protect, allowRoles("admin"), deleteStudent);

module.exports = router;