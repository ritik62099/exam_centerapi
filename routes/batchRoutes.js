const express = require("express");
const {
  createBatch,
  getBatches,
  updateBatch,
  deleteBatch,
} = require("../controllers/batchController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, allowRoles("admin"), getBatches)
  .post(protect, allowRoles("admin"), createBatch);

router
  .route("/:id")
  .put(protect, allowRoles("admin"), updateBatch)
  .delete(protect, allowRoles("admin"), deleteBatch);

module.exports = router;