const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter using Gmail API with OAuth2 (No SMTP_PASS required).
 * Requires:
 *  - GMAIL_API_USER: Sender's Gmail address (e.g. sender@gmail.com)
 *  - GMAIL_API_CLIENT_ID: Google Cloud OAuth2 Client ID for Gmail API
 *  - GMAIL_API_CLIENT_SECRET: Google Cloud OAuth2 Client Secret for Gmail API
 *  - GMAIL_API_REFRESH_TOKEN: Authorized OAuth2 Refresh Token for Gmail
 *  - GMAIL_API_ACCESS_TOKEN: (Optional) Initial Access Token
 */
const createTransporter = () => {
  const user = process.env.GMAIL_API_USER;
  const clientId = process.env.GMAIL_API_CLIENT_ID;
  const clientSecret = process.env.GMAIL_API_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_API_REFRESH_TOKEN;
  const accessToken = process.env.GMAIL_API_ACCESS_TOKEN;

  if (user && clientId && clientSecret && refreshToken) {
    return {
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user,
          clientId,
          clientSecret,
          refreshToken,
          ...(accessToken ? { accessToken } : {}),
        },
      }),
      senderEmail: user,
      mode: 'GMAIL_OAUTH2',
    };
  }

  // Fallback to legacy SMTP only if specifically provided, otherwise null (console fallback)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
      senderEmail: process.env.SMTP_USER,
      mode: 'LEGACY_SMTP',
    };
  }

  return null;
};

const sendOtpEmail = async (toEmail, otpCode) => {
  const config = createTransporter();

  // If no Gmail OAuth or SMTP configured, log code cleanly in console (Development Fallback Mode)
  if (!config) {
    console.log('\n=============================================================');
    console.log('🌲 JUNGLEE WILDLIFE EXPEDITIONS - VERIFICATION CODE (DEV MODE)');
    console.log(`To: ${toEmail}`);
    console.log(`Verification Code (OTP): [ ${otpCode} ]`);
    console.log('Valid for 10 minutes.');
    console.log('ℹ️  To send real emails, provide GMAIL_API_* OAuth credentials in .env');
    console.log('=============================================================\n');
    return { mock: true, code: otpCode };
  }

  const { transporter, senderEmail, mode } = config;

  const mailOptions = {
    from: `"JungleE Wildlife Expeditions" <${senderEmail}>`,
    to: toEmail,
    subject: `Your JungleE Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f1712; color: #f4f6f4; border-radius: 16px; overflow: hidden; border: 1px solid #1f2e24;">
        <div style="background: linear-gradient(135deg, #18281d 0%, #0f1712 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid #283e30;">
          <h1 style="color: #6ee7b7; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 6px 0;">JungleE Wildlife Expeditions</h1>
          <p style="color: #94a398; font-size: 13px; margin: 0;">Uncompromising Wildlife Safari Expeditions</p>
        </div>
        <div style="padding: 36px 28px; background-color: #0f1712;">
          <h2 style="font-size: 18px; color: #ffffff; margin-top: 0; font-weight: 600;">Verify Your Email Address</h2>
          <p style="color: #c0ccc2; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Please enter the following 6-digit verification code to complete your signup or secure account access:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #34d399; background: #18281d; border: 1px solid #283e30; padding: 18px 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              ${otpCode}
            </div>
          </div>
          <p style="color: #839186; font-size: 12px; text-align: center; margin-top: 24px;">
            ⏱️ This verification code is valid for <strong>10 minutes</strong>. If you did not request this code, no action is needed.
          </p>
        </div>
        <div style="background-color: #0b120e; padding: 20px 28px; text-align: center; border-top: 1px solid #18281d;">
          <p style="color: #637066; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} JungleE Wildlife Expeditions. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [GMAIL OAUTH] OTP email sent successfully to ${toEmail} (MessageId: ${info.messageId}) via ${mode}`);
    return info;
  } catch (error) {
    console.error(`❌ [GMAIL OAUTH ERROR] Failed to send email via ${mode}:`, error.message);
    console.log('\n=============================================================');
    console.log('🌲 JUNGLEE VERIFICATION CODE (EMERGENCY CONSOLE FALLBACK)');
    console.log(`To: ${toEmail}`);
    console.log(`Verification Code (OTP): [ ${otpCode} ]`);
    console.log('=============================================================\n');
    return { error: error.message, mock: true, code: otpCode };
  }
};

module.exports = { sendOtpEmail };
