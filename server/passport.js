const GoogleStrategy = require("passport-google-oauth2");
const passport = require("passport");
require("dotenv").config();
passport.use(
    new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/carpost",
        scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback){
        callback(null, profile);
    }
    )
)

passport.serializeUser((user, done) => {
    done(null, user);
  });
  // passport.deserializeUser(User.deserializeUser());
  passport.deserializeUser((user, done) => {
    done(null, user);
  });