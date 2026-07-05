const nodemailer = require("nodemailer");

// ✅ Gmail use kar rahe hain
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // aapka gmail
    pass: process.env.EMAIL_PASS, // App Password (normal password nahi)
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service error:", error.message);
  } else {
    console.log("✅ Email service ready!");
  }
});

const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const mailOptions = {
      from: `"Exam Portal" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };