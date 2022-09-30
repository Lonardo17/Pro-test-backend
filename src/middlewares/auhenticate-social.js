const passport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const { Users } = require("../database/usersSchema");
require("dotenv").config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_CALLBACK = process.env.GOOGLE_REDIRECT_CALLBACK;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const callbackURL = `${GOOGLE_REDIRECT_URI}${GOOGLE_REDIRECT_CALLBACK}`;
const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL,
  passReqToCallback: true,
};

const googleCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { email, displayName } = profile;
    const user = await Users.findOne({ email });
    if (user) {
      return done(null, user);
    }
    const newUser = await Users.create({ email, name: displayName });
    done(null, newUser);
  } catch (err) {
    done(err, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);

passport.use("google", googleStrategy);

module.exports = passport;
