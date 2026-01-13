import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "SendGrid",
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export default transporter;