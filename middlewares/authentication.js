const jwt = require("jsonwebtoken");
const {
  getUserWithRole,
  hasPermission,
} = require("../services/authentication");

const secret = process.env.JWT_SECRET;

function checkForAuthToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
}

function requireRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await getUserWithRole(req.user.user_id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userRole = user.role?.role_name;
      if (!userRole) {
        return res.status(403).json({ message: "No role assigned" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Insufficient permissions",
          required: allowedRoles,
          current: userRole,
        });
      }

      req.currentUser = user;
      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

function requirePermission(resource, action) {
  return async (req, res, next) => {
    try {
      if (!req.currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userPermissions = req.currentUser.role?.permissions;
      if (!userPermissions) {
        return res.status(403).json({ message: "No permissions assigned" });
      }

      if (!hasPermission(userPermissions, resource, action)) {
        return res.status(403).json({
          message: "Insufficient permissions",
          required: { resource, action },
          current: userPermissions,
        });
      }

      next();
    } catch (error) {
      console.error("Permission middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Convenience middleware for specific roles
const requireAdmin = requireRole(["admin"]);
const requireDepartmentOfficer = requireRole(["admin", "department_officer"]);
const requireSupervisor = requireRole([
  "admin",
  "department_officer",
  "supervisor",
]);
const requireCitizen = requireRole([
  "Citizen",
  "admin",
  "department_officer",
  "supervisor",
]);

module.exports = {
  checkForAuthToken,
  requireRole,
  requirePermission,
  requireAdmin,
  requireDepartmentOfficer,
  requireSupervisor,
  requireCitizen,
};
