const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErrs");

// Render Register Page
const registerShow = (req, res) => {
  res.render("register", { errors: req.flash("error") });
};

// Handle Registration
const registerDo = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // password match check
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");
    return res.render("register", { errors: req.flash("error") });
  }

  // create user in DB
  try {
    await User.create({ name, email, password });

    req.flash("info", "Registration successful. Please log in.");
    res.redirect("/logon");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      throw e;
    }
    return res.render("register", { errors: req.flash("error") });
  }
};

// Render Logon Page
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", { 
    csrfToken: req.csrfToken(), 
    errors: req.flash("error")   
  });
};

// Handle Logoff
const logoff = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

module.exports = {
  registerShow,
  registerDo,
  logonShow,
  logoff,
};
