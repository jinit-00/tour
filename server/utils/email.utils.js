const nodemailer = require('nodemailer');

// Configure transport with fallback to console logs if SMTP credentials aren't set
const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendOtpEmail = async (email, otpCode) => {
  const transporter = createTransporter();
  
  const message = `
======================================================
🌲 SILVAN TOURS - VERIFICATION CODE
======================================================
Your verification code is: ${otpCode}
This code will expire in 10 minutes.
If you did not request this, please ignore this email.
======================================================
  `;

  if (!transporter) {
    console.log(`\n📬 [DEVELOPMENT EMAIL FALLBACK] OTP sent to ${email}:`);
    console.log(`🔐 CODE: ${otpCode}\n`);
    return { success: true, mode: 'console' };
  }

  try {
    await transporter.sendMail({
      from: '"Silvan Tours Verification" <no-reply@silvantours.com>',
      to: email,
      subject: `Silvan Tours - Verification Code: ${otpCode}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0a1610; color: #e6dec8; padding: 30px; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #d4af37; margin-bottom: 10px;">Silvan Tours</h2>
          <p style="font-size: 15px;">Your account verification code is:</p>
          <div style="background-color: #12241b; color: #d4af37; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="font-size: 13px; color: #9ab4a3;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });
    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error.message);
    console.log(`🔐 Dev OTP Fallback for ${email}: ${otpCode}`);
    return { success: true, mode: 'console-fallback' };
  }
};

module.exports = {
  sendOtpEmail,
};
