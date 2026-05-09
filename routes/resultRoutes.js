// const express = require("express");
// const {
//   getExamResults,
//   getStudentResultsByAdmin,
// } = require("../controllers/resultController");

// const { protect } = require("../middleware/authMiddleware");
// const { allowRoles } = require("../middleware/roleMiddleware");

// const router = express.Router();

// router.get(
//   "/exam/:examId",
//   protect,
//   allowRoles("admin"),
//   getExamResults
// );

// router.get(
//   "/student/:studentId",
//   protect,
//   allowRoles("admin"),
//   getStudentResultsByAdmin
// );

// module.exports = router;




const express = require("express");

const {
  getExamResults,
  getStudentResultsByAdmin,
  downloadMyResultPdf,
} = require("../controllers/resultController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/*
  Admin: Exam ke sabhi results
  URL: /api/results/exam/:examId
*/
router.get(
  "/exam/:examId",
  protect,
  allowRoles("admin"),
  getExamResults
);

/*
  Admin: Student ke sabhi results
  URL: /api/results/student/:studentId
*/
router.get(
  "/student/:studentId",
  protect,
  allowRoles("admin"),
  getStudentResultsByAdmin
);

/*
  Student: Apna result PDF download
  URL: /api/results/student/results/:resultId/pdf
*/
router.get(
  "/student/results/:resultId/pdf",
  protect,
  allowRoles("student"),
  downloadMyResultPdf
);

module.exports = router;