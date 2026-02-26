const express = require("express");
const passport = require("passport");
const router = express.Router();
const sessionController = require("../controllers/sessionController")

// Register
router
  .route("/register")
  .get(sessionController.registerShow)
  .post(sessionController.registerDo)

// Logon
router
  .route("/logon")
  .get(sessionController.logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );

// Logoff   
router.post("/logoff", sessionController.logoff)

module.exports = router;