const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendOtpEmail = async (toEmail, otpCode) => {
  const transporter = createTransporter();

  // If no SMTP configured, log code cleanly in console (Development Fallback Mode)
  if (!transporter) {
    console.log('\n==================================================');
    console.log('🌲 JUNGLEE WILDLIFE EXPEDITIONS - VERIFICATION CODE');
    console.log(`To: ${toEmail}`);
    console.log(`Verification Code (OTP): [ ${otpCode} ]`);
    console.log('Valid for 10 minutes.');
    console.log('==================================================\n');
    return { mock: true, code: otpCode };
  }

  const mailOptions = {
    from: '"JungleE Wildlife Expeditions" <no-reply@junglee.com>',
    to: toEmail,
    subject: `JungleE Wildlife Expeditions - Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #142219; color: #f2efe6;">
        <h2 style="color: #87957d; margin-bottom: 10px;">JungleE Wildlife Expeditions</h2>
        <p>Your 6-digit email verification code is:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #87957d; padding: 15px; background: #1f3324; border-radius: 8px; text-align: center; margin: 20px 0;">
          ${otpCode}
        </div>
        <p style="font-size: 12px; color: #aeb9aa;">This code expires in 10 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
