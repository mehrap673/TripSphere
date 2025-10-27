import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ 
            $or: [
              { email: profile.emails[0].value },
              { 'googleAuth.googleId': profile.id }
            ]
          });

          if (user) {
            // Update Google auth info if needed
            if (!user.googleAuth || !user.googleAuth.googleId) {
              user.googleAuth = {
                googleId: profile.id,
                email: profile.emails[0].value,
                displayName: profile.displayName,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                photo: profile.photos?.[0]?.value || '',
                verified: profile.emails[0].verified
              };
              user.isVerified = true;
              if (!user.avatar) {
                user.avatar = profile.photos?.[0]?.value || '';
              }
              await user.save();
            }
            return done(null, user);
          }

          // Create new user with Google profile data
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos?.[0]?.value || '',
            password: 'google-oauth-' + Math.random().toString(36).slice(-8),
            role: 'user',
            isVerified: true,
            googleAuth: {
              googleId: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              photo: profile.photos?.[0]?.value || '',
              verified: profile.emails[0].verified
            }
          });

          await user.save();

          // Award welcome badge
          user.gamification.badges.push({
            name: 'Welcome Traveler',
            icon: '👋',
            earnedAt: new Date(),
            description: 'Joined Smart Travel Planner!'
          });
          user.gamification.points += 50;
          await user.save();

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
