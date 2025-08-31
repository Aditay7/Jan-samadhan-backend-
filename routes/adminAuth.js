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
  requireAdmin,
  requireDepartmentOfficer,
} = require("../middlewares/authentication");
const handleValidationErrors = require("../middlewares/validation");

const router = Router();

// Web dashboard login (admin/department)
router.post("/web-login", validateWebLogin, handleValidationErrors, WebLogin);

// Admin routes (require admin authentication)
router.post(
  "/create-department-user",
  checkForAuthToken,
  requireAdmin,
  validateCreateDepartmentUser,
  handleValidationErrors,
  CreateDepartmentUser
);

router.get("/users/:role", checkForAuthToken, requireAdmin, GetUsersByRole);

// Department routes (require department officer authentication)
router.post(
  "/create-supervisor",
  checkForAuthToken,
  requireDepartmentOfficer,
  validateCreateSupervisor,
  handleValidationErrors,
  CreateSupervisor
);

module.exports = router;
