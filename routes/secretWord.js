const express = require("express");
const router = express.Router();

// GET /secretWord
router.get("/", (req, res) => {
  res.render("secretWord", {
    secretWord: req.user.secretWord,
  });
});

// POST /secretWord
router.post("/", async (req, res) => {
  try {
    const newWord = req.body.secretWord;

    if (newWord.toUpperCase()[0] === "P") {
      req.flash("error", "You can't use words that start with P.");
    } else {
      req.user.secretWord = newWord;
      await req.user.save(); // important!
      req.flash("info", "The secret word was changed.");
    }

    res.redirect("/secretWord");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while updating the secret word.");
    res.redirect("/secretWord");
  }
});

module.exports = router;
