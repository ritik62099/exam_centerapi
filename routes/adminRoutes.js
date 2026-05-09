const express = require("express");
const {
  loginAdmin,
  getAdminDashboardStats,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.get(
  "/dashboard-stats",
  protect,
  allowRoles("admin"),
  getAdminDashboardStats
);

module.exports = router;