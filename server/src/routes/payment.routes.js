const express = require("express");
const router = express.Router();

const { handlePaymentAndEnroll } = require("../controllers/payment.controller");
const { mockPayment } = require("../middlewares/mockPayment.middleware");
const { verifyToken } = require("../middlewares/auth.middlewares");

// POST /api/payment/:courseId
router.post("/:courseId", verifyToken, mockPayment, handlePaymentAndEnroll);

module.exports = router;
