// const express = require("express");
// const {
//   createExam,
//   getExams,
//   getExamById,
//   updateExam,
//   deleteExam,
//   publishExam,
//   unpublishExam,
//   releaseResult,
//   hideResult,
//   getStudentExamById,
// } = require("../controllers/examController");

// const { protect } = require("../middleware/authMiddleware");
// const { allowRoles } = require("../middleware/roleMiddleware");

// const router = express.Router();

// router
//   .route("/")
//   .get(protect, allowRoles("admin"), getExams)
//   .post(protect, allowRoles("admin"), createExam);

//   router.get(
//   "/exams/:examId",
//   protect,
//   allowRoles("student"),
//   getStudentExamById
// );

// router.put("/:id/publish", protect, allowRoles("admin"), publishExam);
// router.put("/:id/unpublish", protect, allowRoles("admin"), unpublishExam);
// router.put("/:id/release-result", protect, allowRoles("admin"), releaseResult);
// router.put("/:id/hide-result", protect, allowRoles("admin"), hideResult);

// router
//   .route("/:id")
//   .get(protect, allowRoles("admin"), getExamById)
//   .put(protect, allowRoles("admin"), updateExam)
//   .delete(protect, allowRoles("admin"), deleteExam);

// module.exports = router;




const express = require("express");
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  unpublishExam,
  releaseResult,
  hideResult,
} = require("../controllers/examController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin: create/list exams
router
  .route("/")
  .get(protect, allowRoles("admin"), getExams)
  .post(protect, allowRoles("admin"), createExam);

// Admin: publish/unpublish/result actions
router.put("/:id/publish", protect, allowRoles("admin"), publishExam);
router.put("/:id/unpublish", protect, allowRoles("admin"), unpublishExam);
router.put("/:id/release-result", protect, allowRoles("admin"), releaseResult);
router.put("/:id/hide-result", protect, allowRoles("admin"), hideResult);

// Admin: single exam CRUD
router
  .route("/:id")
  .get(protect, allowRoles("admin"), getExamById)
  .put(protect, allowRoles("admin"), updateExam)
  .delete(protect, allowRoles("admin"), deleteExam);

module.exports = router;