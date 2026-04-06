const ApiError = require("../utils/ApiError");

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied: ${req.user.role} role is not authorized`);
    }

    next();
  };
};
