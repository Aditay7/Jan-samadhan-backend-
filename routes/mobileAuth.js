const { Router } = require("express");
const {
  SendOTP,
  VerifyOTP,
  CompleteProfile,
  UpdateProfile,
  ResendOTP,
  validateSendOTP,
  validateVerifyOTP,
  validateCompleteProfile,
  validateUpdateProfile,
} = require("../controllers/mobileAuth");
const { checkForAuthToken } = require("../middlewares/authentication");
const handleValidationErrors = require("../middlewares/validation");

const router = Router();

// Step 1: Send OTP for registration/login
router.post("/send-otp", validateSendOTP, handleValidationErrors, SendOTP);

// Step 2: Verify OTP and determine next step
router.post(
  "/verify-otp",
  validateVerifyOTP,
  handleValidationErrors,
  VerifyOTP
);

// Step 3: Complete profile (for new users after OTP verification)
router.post(
  "/complete-profile",
  validateCompleteProfile,
  handleValidationErrors,
  CompleteProfile
);

// Resend OTP
router.post("/resend-otp", validateSendOTP, handleValidationErrors, ResendOTP);

// Update profile (for existing users - requires auth)
router.put(
  "/update-profile",
  checkForAuthToken,
  validateUpdateProfile,
  handleValidationErrors,
  UpdateProfile
);

module.exports = router;
