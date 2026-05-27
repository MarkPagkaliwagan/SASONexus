import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationCode(email: string, code: string) {
  await transporter.sendMail({
    from: `"SASO Nexus" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Cumulative Record Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #007848; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">SASO Nexus</h1>
        </div>
        <div style="background: #f9f9f9; padding: 32px 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 14px; margin-top: 0;">You requested to access your Cumulative Record Folder.</p>
          <p style="color: #333; font-size: 14px;">Use the verification code below:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007848; letter-spacing: 8px; background: #e8f5e9; padding: 12px 24px; border-radius: 8px; display: inline-block;">${code}</span>
          </div>
          <p style="color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendStaffOtpEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"SASO Nexus" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Staff Login Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #007848; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">SASO Nexus</h1>
        </div>
        <div style="background: #f9f9f9; padding: 32px 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 14px; margin-top: 0;">A login attempt was made to your staff account.</p>
          <p style="color: #333; font-size: 14px;">Use the verification code below to complete login:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007848; letter-spacing: 8px; background: #e8f5e9; padding: 12px 24px; border-radius: 8px; display: inline-block;">${code}</span>
          </div>
          <p style="color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you did not attempt to log in, please contact your administrator immediately.</p>
        </div>
      </div>
    `,
  });

  if (process.env.BCC_EMAIL) {
    await transporter.sendMail({
      from: `"SASO Nexus" <${process.env.SMTP_USER}>`,
      to: process.env.BCC_EMAIL,
      subject: `OTP Login: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #b8860b; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">SASO Nexus — OTP Notification</h1>
          </div>
          <div style="background: #f9f9f9; padding: 32px 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #333; font-size: 14px; margin-top: 0;"><strong>Staff OTP Login</strong></p>
            <p style="color: #333; font-size: 14px;">Email: <strong>${email}</strong></p>
            <p style="color: #333; font-size: 14px;">Code: <strong style="font-size: 24px; letter-spacing: 4px;">${code}</strong></p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated notification. No action required.</p>
          </div>
        </div>
      `,
    });
  }
}
