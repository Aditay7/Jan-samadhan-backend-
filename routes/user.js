const { Router } = require("express");
const { body } = require("express-validator");
const {
  RegisterUser,
  LoginUser,
  RefreshToken,
  GetProfile,
  UpdateProfile,
  ChangePassword,
  Logout,
} = require("../controllers/user");
const {
  checkForAuthToken,
  requireAdmin,
} = require("../middlewares/authentication");
const handleValidationErrors = require("../middlewares/validation");

const router = Router();

// Validation middleware
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone_number")
    .optional()
    .isMobilePhone()
    .withMessage("Valid phone number required"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("phone_number")
    .optional()
    .isMobilePhone()
    .withMessage("Valid phone number required"),
];

const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

// Public routes
router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  RegisterUser
);
router.post("/login", validateLogin, handleValidationErrors, LoginUser);
router.post("/refresh", RefreshToken);

// Protected routes
router.get("/profile", checkForAuthToken, GetProfile);
router.put(
  "/profile",
  checkForAuthToken,
  validateProfileUpdate,
  handleValidationErrors,
  UpdateProfile
);
router.put(
  "/change-password",
  checkForAuthToken,
  validatePasswordChange,
  handleValidationErrors,
  ChangePassword
);
router.post("/logout", checkForAuthToken, Logout);

// Admin-only routes
router.post(
  "/register-admin",
  checkForAuthToken,
  requireAdmin,
  validateRegistration,
  handleValidationErrors,
  RegisterUser
);

module.exports = router;
