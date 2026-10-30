const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./prisma');

// Google Sign-In OAuth credentials (separate from Gmail API email sending)
const clientID = process.env.GOOGLE_SIGNIN_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || 'DUMMY_CLIENT_ID';
const clientSecret = process.env.GOOGLE_SIGNIN_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'DUMMY_CLIENT_SECRET';
const defaultCallback = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/auth/google/callback`
  : 'http://localhost:5001/api/auth/google/callback';
const callbackURL = process.env.GOOGLE_SIGNIN_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL || defaultCallback;

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const googleId = profile.id;
        const name = profile.displayName || 'Explorer';

        if (!email) {
          return done(new Error('Google profile did not return an email address'), null);
        }

        const isAdminEmail =
          email === 'jinitsoneji@gmail.com' ||
          email === process.env.ADMIN_EMAIL ||
          email.endsWith('@junglee.com') ||
          email.startsWith('admin@');
        const role = isAdminEmail ? 'ADMIN' : 'USER';

        // Check existing user by Google ID or Email
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId }, { email }],
          },
        });

        if (user) {
          const updateData = { isVerified: true };
          if (!user.googleId) updateData.googleId = googleId;
          if (isAdminEmail && user.role !== 'ADMIN') updateData.role = 'ADMIN';

          user = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });
        } else {
          user = await prisma.user.create({
            data: {
              name,
              email,
              googleId,
              isVerified: true,
              role,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
