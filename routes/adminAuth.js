const { Router } = require("express");
const {
  WebLogin,
  CreateDepartmentUser,
  CreateSupervisor,
  GetUsersByRole,
  validateWebLogin,
  validateCreateDepartmentUser,
  validateCreateSupervisor,
} = require("../controllers/adminAuth");
const {
  checkForAuthToken,
  requireRole,
  requirePermission,
} = require("../middlewares/authentication");
const handleValidationErrors = require("../middlewares/validation");

const router = Router();

// Web dashboard login (admin/department)
router.post("/web-login", validateWebLogin, handleValidationErrors, WebLogin);

// Admin routes (require admin authentication)
router.post(
  "/create-department-user",
  checkForAuthToken,
  requireRole(["admin"]),
  validateCreateDepartmentUser,
  handleValidationErrors,
  CreateDepartmentUser
);

router.get(
  "/users/:role",
  checkForAuthToken,
  requireRole(["admin"]),
  GetUsersByRole
);

// Department routes (require department officer authentication)
router.post(
  "/create-supervisor",
  checkForAuthToken,
  requireRole(["department_officer"]),
  validateCreateSupervisor,
  handleValidationErrors,
  CreateSupervisor
);

module.exports = router;
