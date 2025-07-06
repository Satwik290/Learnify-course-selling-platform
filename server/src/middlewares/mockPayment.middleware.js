exports.mockPayment = (req, res, next) => {
  // Simulate 90% success rate
  const success = Math.random() < 0.9;

  if (!success) {
    return res.status(402).json({ error: "💳 Payment failed. Please try again." });
  }

  req.paymentStatus = "success";
  next();
};
