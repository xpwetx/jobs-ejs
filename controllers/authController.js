const User = require("../models/User");
const parseValidationErrors = require("../util/parseValidationErrs");

// Render register page
exports.registerShow = (req, res) => {
  res.render("register");
};

// Render login page
exports.logonShow = (req, res) => {
  res.render("login");
};

// Handle registration
exports.registerDo = async (req, res) => {
  try {
    const { name, email, password, password1 } = req.body;

    if (password !== password1) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/register");
    }

    await User.create(req.body);

    res.redirect("/");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseValidationErrors(e, req);
      return res.redirect("/register");
    }

    if (e.code === 11000) {
      req.flash("error", "Username already exists.");
      return res.redirect("/register");
    }

    req.flash("error", "Something went wrong.");
    res.redirect("/register");
  }
};

// Handle logoff
exports.logoff = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect("/sessions/login");
  });
};