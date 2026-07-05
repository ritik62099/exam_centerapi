const express = require("express");
const {
  createInstitute,
  getInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
} = require("../controllers/instituteController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, allowRoles("admin"), getInstitutes)
  .post(protect, allowRoles("admin"), upload.single("logo"), createInstitute);

router
  .route("/:id")
  .get(protect, allowRoles("admin"), getInstituteById)
  .put(protect, allowRoles("admin"), upload.single("logo"), updateInstitute)
  .delete(protect, allowRoles("admin"), deleteInstitute);

module.exports = router;