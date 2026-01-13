// import transporter from "../config/email";
import { ApiError } from "../utils/ApiError";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export class EmailService {
  // Send generic email
  static async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    try {
      const msg: any = {
        from: process.env.SENDGRID_FROM_EMAIL!,
        to: options.to,
        subject: options.subject,
      };

      if (options.html) {
        msg.html = options.html;
      }

      if (options.text) {
        msg.text = options.text;
      }

      await sgMail.send(msg);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      throw new ApiError(500, "Failed to send email");
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(user: { name: string; email: string }) {
    const subject = "Welcome to Our Service!";
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Welcome, ${user.name}! 🎉</h1>
        <p>Thank you for signing up for our service.</p>
        <p>We're excited to have you on board!</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <br>
        <p>Best regards,<br>The Team</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  // Send password reset email
  static async sendPasswordResetEmail(
    user: { name: string; email: string },
    resetToken: string
  ) {
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const resetUrlDev = `http://localhost:5173/auth/resetPassword/${resetToken}`;

    const subject = "Password Reset Request";
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Password Reset</h1>
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrlDev}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        ">Reset Password</a>
        <p>Or copy and paste this link:</p>
        <p>${resetUrlDev}</p>
        <p><strong>This link will expire in 5 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The Team</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  // Send ticket notification
  static async sendTicketCreatedEmail(ticket: {
    ticketNumber: string;
    customer: { name: string; email: string };
    device: { model: string };
  }) {
    const subject = `New Ticket Created - ${ticket.ticketNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Ticket Created Successfully! 🎫</h1>
        <p>Hi ${ticket.customer.name},</p>
        <p>Your repair ticket has been created.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Device:</strong> ${ticket.device.model}</p>
        </div>
        <p>We'll notify you when there are updates on your repair.</p>
        <p>You can track your ticket status at any time.</p>
        <br>
        <p>Best regards,<br>The Repair Team</p>
      </div>
    `;

    await this.sendEmail({
      to: ticket.customer.email,
      subject,
      html,
    });
  }

  // Send ticket status update
  static async sendTicketStatusUpdate(ticket: {
    ticketNumber: string;
    status: string;
    customer: { name: string; email: string };
  }) {
    const subject = `Ticket Update - ${ticket.ticketNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Ticket Status Updated 📋</h1>
        <p>Hi ${ticket.customer.name},</p>
        <p>Your ticket status has been updated.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>New Status:</strong> <span style="color: #007bff;">${ticket.status}</span></p>
        </div>
        <p>Thank you for your patience!</p>
        <br>
        <p>Best regards,<br>The Repair Team</p>
      </div>
    `;

    await this.sendEmail({
      to: ticket.customer.email,
      subject,
      html,
    });
  }
}
