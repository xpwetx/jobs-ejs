// config/passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const passportInit = () => {
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) return done(null, false, { message: "Incorrect credentials." });

          const match = await user.comparePassword(password);
          if (!match) return done(null, false, { message: "Incorrect credentials." });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = passportInit;