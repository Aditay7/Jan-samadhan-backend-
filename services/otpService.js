const { User } = require("../models");
const smsService = require("./smsService");

class OTPService {
  /**
   * Generate OTP for mobile authentication
   */
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Step 1: Send OTP for registration/login
   */
  static async sendOTP(phoneNumber) {
    try {
      // Validate phone number
      if (!smsService.validatePhoneNumber(phoneNumber)) {
        throw new Error("Invalid phone number format");
      }

      // Generate 6-digit OTP
      const otp = this.generateOTP();

      // Set expiration (5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Check if user already exists
      let user = await User.findOne({ where: { phone_number: phoneNumber } });
      const isExistingUser = !!user;

      if (!user) {
        // Create temporary user for new registration
        const { Role } = require("../models");
        const citizenRole = await Role.findOne({
          where: { role_name: "citizen" },
        });

        user = await User.create({
          phone_number: phoneNumber,
          name: null, // Will be filled after OTP verification
          role_id: citizenRole.role_id,
          login_method: "otp",
          is_phone_verified: false,
          is_active: true,
        });
      }

      // Update OTP
      await user.update({
        otp: otp,
        otp_expires_at: expiresAt,
      });

      // Send OTP via SMS
      const formattedPhone = smsService.formatPhoneNumber(phoneNumber);
      const smsResult = await smsService.sendOTP(formattedPhone, otp);

      return {
        success: true,
        message: "OTP sent successfully",
        phone_number: phoneNumber,
        is_existing_user: isExistingUser,
        user_id: user.user_id,
        sms_status: smsResult,
      };
    } catch (error) {
      console.error("OTP send error:", error);
      throw error;
    }
  }

  /**
   * Step 2: Verify OTP and return user status
   */
  static async verifyOTP(phoneNumber, otp) {
    try {
      const user = await User.findOne({
        where: { phone_number: phoneNumber },
        include: [{ model: require("../models").Role, as: "role" }],
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.verifyOTP(otp)) {
        throw new Error("Invalid or expired OTP");
      }

      // Clear OTP after successful verification
      await user.update({
        otp: null,
        otp_expires_at: null,
        is_phone_verified: true,
        last_login: new Date(),
      });

      // Check if user profile is complete
      const isProfileComplete = user.name && user.name !== "Citizen";

      if (isProfileComplete) {
        // Existing user with complete profile - generate tokens and login
        const { createTokenForUser } = require("./authentication");
        const tokens = createTokenForUser(user);

        return {
          success: true,
          message: "Login successful",
          is_existing_user: true,
          is_profile_complete: true,
          user_id: user.user_id,
          ...tokens,
          user: {
            id: user.user_id,
            name: user.name,
            phone_number: user.phone_number,
            email: user.email,
            address: user.address,
            role: user.role.role_name,
            permissions: user.role.permissions,
            is_phone_verified: user.is_phone_verified,
          },
        };
      } else {
        // New user or incomplete profile - need to complete registration
        return {
          success: true,
          message: "OTP verified. Please complete your profile.",
          is_existing_user: false,
          is_profile_complete: false,
          user_id: user.user_id,
          requires_profile_completion: true,
        };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  }

  /**
   * Step 3: Complete profile after OTP verification
   */
  static async completeProfile(userId, profileData) {
    try {
      const user = await User.findByPk(userId, {
        include: [{ model: require("../models").Role, as: "role" }],
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.is_phone_verified) {
        throw new Error("Phone number not verified");
      }

      // Update profile data
      const updateData = {};
      if (profileData.name) updateData.name = profileData.name;
      if (profileData.email) updateData.email = profileData.email;
      if (profileData.address) updateData.address = profileData.address;

      await user.update(updateData);

      // Generate tokens for completed registration
      const { createTokenForUser } = require("./authentication");
      const tokens = createTokenForUser(user);

      return {
        success: true,
        message: "Profile completed successfully",
        is_existing_user: false,
        is_profile_complete: true,
        ...tokens,
        user: {
          id: user.user_id,
          name: user.name,
          phone_number: user.phone_number,
          email: user.email,
          address: user.address,
          role: user.role.role_name,
          permissions: user.role.permissions,
          is_phone_verified: user.is_phone_verified,
        },
      };
    } catch (error) {
      console.error("Profile completion error:", error);
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  static async resendOTP(phoneNumber) {
    return await this.sendOTP(phoneNumber);
  }

  /**
   * Update user profile (for existing users)
   */
  static async updateProfile(userId, profileData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const updateData = {};
      if (profileData.name) updateData.name = profileData.name;
      if (profileData.email) updateData.email = profileData.email;
      if (profileData.address) updateData.address = profileData.address;

      await user.update(updateData);

      return {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user.user_id,
          name: user.name,
          phone_number: user.phone_number,
          email: user.email,
          address: user.address,
        },
      };
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }
}

module.exports = OTPService;
