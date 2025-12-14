import twilio from "twilio";
import { ApiError } from "../utils/ApiError.js";
import { twilioClient } from "src/config/twilio.js";



export class OTPService {
  // Send OTP via SMS
  static async sendSMS(phone: string, otp: string) {
    // Development mode - just log to console
    if (process.env.NODE_ENV === "development" || !twilioClient) {
      console.log("📱 [DEV MODE] SMS OTP");
      console.log("==================");
      console.log(`Phone: ${phone}`);
      console.log(`OTP Code: ${otp}`);
      console.log("==================");
      return { success: true, mode: "development" };
    }

    // Production mode - send real SMS
    try {
      const message = await twilioClient.messages.create({
        body: `Your verification code is: ${otp}. Valid for 1 minute.`,
        from: "+96876500204",
        to: phone,
      });

      console.log("✅ SMS sent:", message.sid);
      return { success: true, mode: "production", messageId: message.sid };
    } catch (error: any) {
      console.error("❌ SMS sending failed:", error);
      throw new ApiError(500, "Failed to send OTP. Please try again.");
    }
  }

  // Send OTP via Email (as backup)
  static async sendEmail(email: string, otp: string) {
    // Development mode
    if (process.env.NODE_ENV === "development") {
      console.log("📧 [DEV MODE] Email OTP");
      console.log("==================");
      console.log(`Email: ${email}`);
      console.log(`OTP Code: ${otp}`);
      console.log("==================");
      return { success: true, mode: "development" };
    }

    // Production mode - use your EmailService
    // await EmailService.sendOTPEmail(email, otp);
    return { success: true, mode: "production" };
  }
}