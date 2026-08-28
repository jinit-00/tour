const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clientID = process.env.GOOGLE_CLIENT_ID || 'DUMMY_CLIENT_ID';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'DUMMY_CLIENT_SECRET';

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
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

        // Check existing user by Google ID or Email
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId }, { email }],
          },
        });

        if (user) {
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId, isVerified: true },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              name,
              email,
              googleId,
              isVerified: true,
              role: 'USER',
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
