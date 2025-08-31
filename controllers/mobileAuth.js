const OTPService = require("../services/otpService");
const { body } = require("express-validator");

// Step 1: Send OTP for registration/login
const SendOTP = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const result = await OTPService.sendOTP(phone_number);

    res.json({
      message: "OTP sent successfully",
      phone_number: result.phone_number,
      is_existing_user: result.is_existing_user,
      user_id: result.user_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
};

// Step 2: Verify OTP and determine next step
const VerifyOTP = async (req, res) => {
  try {
    const { phone_number, otp } = req.body;

    if (!phone_number || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    const result = await OTPService.verifyOTP(phone_number, otp);

    res.json({
      message: result.message,
      is_existing_user: result.is_existing_user,
      is_profile_complete: result.is_profile_complete,
      user_id: result.user_id,
      requires_profile_completion: result.requires_profile_completion,
      // Include tokens and user data if profile is complete
      ...(result.accessToken && { accessToken: result.accessToken }),
      ...(result.refreshToken && { refreshToken: result.refreshToken }),
      ...(result.user && { user: result.user }),
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "OTP verification failed" });
  }
};

// Step 3: Complete profile (for new users)
const CompleteProfile = async (req, res) => {
  try {
    const { user_id, name, email, address } = req.body;

    if (!user_id || !name) {
      return res.status(400).json({ message: "User ID and name are required" });
    }

    const result = await OTPService.completeProfile(user_id, {
      name,
      email,
      address,
    });

    res.json({
      message: "Registration completed successfully",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || "Failed to complete profile" });
  }
};

// Update profile (for existing users)
const UpdateProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const userId = req.user.user_id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const result = await OTPService.updateProfile(userId, {
      name,
      email,
      address,
    });

    res.json({
      message: "Profile updated successfully",
      user: result.user,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || "Failed to update profile" });
  }
};

// Resend OTP
const ResendOTP = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const result = await OTPService.resendOTP(phone_number);

    res.json({
      message: "OTP resent successfully",
      phone_number: result.phone_number,
      is_existing_user: result.is_existing_user,
      user_id: result.user_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to resend OTP" });
  }
};

// Validation middleware
const validateSendOTP = [
  body("phone_number")
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
];

const validateVerifyOTP = [
  body("phone_number")
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be 6 digits"),
];

const validateCompleteProfile = [
  body("user_id").isInt().withMessage("Valid user ID is required"),
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
];

const validateUpdateProfile = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
];

module.exports = {
  SendOTP,
  VerifyOTP,
  CompleteProfile,
  UpdateProfile,
  ResendOTP,
  validateSendOTP,
  validateVerifyOTP,
  validateCompleteProfile,
  validateUpdateProfile,
};
