const express = require("express");
const { submitExam } = require("../controllers/submissionController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/:examId/submit",
  protect,
  allowRoles("student"),
  submitExam
);

module.exports = router;