const nodemailer = require("nodemailer");

let transporter = null;

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Automatic testing inbox fallback with 1-click preview link in terminal
  console.log("⚡ Notice: No external SMTP credentials detected in .env. Initializing local Ethereal test inbox...");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendPasswordResetEmail = async (toEmail, resetUrl, userName = "Student") => {
  if (!transporter) {
    transporter = await createTransporter();
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 520px; margin: 20px auto; background: #ffffff; border-radius: 16px; padding: 36px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }
        .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 12px; }
        .content { font-size: 15px; line-height: 1.6; color: #475569; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; font-weight: 600; text-decoration: none; font-size: 15px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35); }
        .footer { font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">🎓 EduPortal</div>
          <div class="title">Reset Your Password</div>
        </div>
        <div class="content">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for the Course Registration Portal. Click the button below to choose a new password:</p>
          <div class="btn-wrapper">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
          </div>
          <p>This password reset link is valid for <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email.</p>
          <p style="word-break: break-all; font-size: 13px; color: #64748b;">
            Can't click the button? Copy and paste this URL into your browser:<br/>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
        <div class="footer">
          Course Registration Portal • Secure Student Services
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Course Portal Support" <${process.env.EMAIL_FROM || "no-reply@courseportal.edu"}>`,
    to: toEmail,
    subject: "Reset your Course Portal Password",
    html: htmlContent,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("-------------------------------------------------------");
    console.log("✉️ Real Email Preview Link (Ethereal test sandbox):");
    console.log(previewUrl);
    console.log("-------------------------------------------------------");
  }

  return { info, previewUrl };
};

const checkEmailSetup = async () => {
  try {
    transporter = await createTransporter();
    console.log("Email dispatch service initialized successfully");
  } catch (err) {
    console.warn("Email service warning:", err.message);
  }
};

module.exports = { sendPasswordResetEmail, checkEmailSetup };
