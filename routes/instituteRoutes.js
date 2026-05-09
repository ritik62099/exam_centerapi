const express = require("express");
const {
  createInstitute,
  getInstitutes,
  updateInstitute,
  deleteInstitute,
} = require("../controllers/instituteController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, allowRoles("admin"), getInstitutes)
  .post(protect, allowRoles("admin"), createInstitute);

router
  .route("/:id")
  .put(protect, allowRoles("admin"), updateInstitute)
  .delete(protect, allowRoles("admin"), deleteInstitute);

module.exports = router;