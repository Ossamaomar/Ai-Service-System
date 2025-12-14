import crypto from "crypto";

export class OTPUtil {
  // Generate 6-digit OTP
  static generate(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Generate OTP with expiry (1 minutes)
  static generateWithExpiry() {
    const otp = this.generate();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
    return { otp, expiresAt };
  }

  // Hash OTP for storage (security best practice)
  static hash(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }

  // Verify OTP
  static verify(inputOtp: string, hashedOtp: string): boolean {
    const hashedInput = this.hash(inputOtp);
    return hashedInput === hashedOtp;
  }

  // Check if OTP is expired
  static isExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}