const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this route",
      });
    }

    next();
  };
};

module.exports = { allowRoles };