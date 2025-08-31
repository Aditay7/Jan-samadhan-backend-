const twilio = require("twilio");

class SMSService {
  constructor() {
    // Initialize Twilio client
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Send OTP via SMS
   */
  async sendOTP(phoneNumber, otp) {
    try {
      // Check if Twilio is configured
      if (!this.client || !this.fromNumber) {
        console.log(`📱 [SMS] OTP for ${phoneNumber}: ${otp}`);
        return {
          success: true,
          message: "OTP sent (console mode)",
          sid: "console_mode",
        };
      }

      // Send SMS via Twilio
      const message = await this.client.messages.create({
        body: `Your Jal Samadhan OTP is: ${otp}. Valid for 5 minutes.`,
        from: this.fromNumber,
        to: phoneNumber,
      });

      console.log(
        `📱 [SMS] OTP sent to ${phoneNumber} via Twilio. SID: ${message.sid}`
      );

      return {
        success: true,
        message: "OTP sent successfully",
        sid: message.sid,
      };
    } catch (error) {
      console.error("📱 [SMS] Error sending OTP:", error.message);

      // Fallback to console mode
      console.log(`📱 [SMS] OTP for ${phoneNumber}: ${otp} (fallback mode)`);

      return {
        success: true,
        message: "OTP sent (fallback mode)",
        sid: "fallback_mode",
        error: error.message,
      };
    }
  }

  /**
   * Send notification SMS
   */
  async sendNotification(phoneNumber, message) {
    try {
      if (!this.client || !this.fromNumber) {
        console.log(`📱 [SMS] Notification to ${phoneNumber}: ${message}`);
        return { success: true, sid: "console_mode" };
      }

      const sms = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber,
      });

      console.log(
        `📱 [SMS] Notification sent to ${phoneNumber}. SID: ${sms.sid}`
      );
      return { success: true, sid: sms.sid };
    } catch (error) {
      console.error("📱 [SMS] Error sending notification:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send issue status update
   */
  async sendIssueUpdate(phoneNumber, issueId, status, description) {
    const message = `Issue #${issueId} status updated to: ${status}. ${description}`;
    return await this.sendNotification(phoneNumber, message);
  }

  /**
   * Send assignment notification
   */
  async sendAssignmentNotification(phoneNumber, issueId, department) {
    const message = `Issue #${issueId} has been assigned to ${department}. You will receive updates on this number.`;
    return await this.sendNotification(phoneNumber, message);
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber) {
    // Basic validation for Indian numbers
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const internationalRegex = /^\+[1-9]\d{1,14}$/;

    return (
      indianPhoneRegex.test(phoneNumber) || internationalRegex.test(phoneNumber)
    );
  }

  /**
   * Format phone number for SMS
   */
  formatPhoneNumber(phoneNumber) {
    // If it's a 10-digit Indian number, add +91
    if (/^[6-9]\d{9}$/.test(phoneNumber)) {
      return `+91${phoneNumber}`;
    }
    return phoneNumber;
  }
}

module.exports = new SMSService();
