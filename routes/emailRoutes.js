const express = require("express");
const {
  sendAdmitCardEmail,
  sendBulkAdmitCardEmails,
} = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Body parser limit badhao kyunki PDF base64 bada hota hai
router.use(express.json({ limit: "50mb" }));

router.post(
  "/send-admit-card",
  protect,
  allowRoles("admin"),
  sendAdmitCardEmail
);

router.post(
  "/send-bulk-admit-cards",
  protect,
  allowRoles("admin"),
  sendBulkAdmitCardEmails
);

module.exports = router;