export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: "User role not found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Access denied. Role not authorized." });
    }

    next();
  };
};
