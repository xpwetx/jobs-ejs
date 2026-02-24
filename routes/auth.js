const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");

// Show pages
router.get("/register", authController.registerShow);
router.get("/login", authController.logonShow);

// Handle registration
router.post("/register", authController.registerDo);

// Login handled by Passport
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logoff
router.get("/logout", authController.logoff);

module.exports = router;