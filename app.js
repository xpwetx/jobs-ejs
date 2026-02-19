// ========================
// 1️⃣ Imports
// ========================
const express = require("express");
require("dotenv").config(); // Load .env
require("express-async-errors"); // Async error handling

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const flash = require("connect-flash");

// Mongo connection helper
const connectDB = require("./db/connect");

// ========================
// 2️⃣ App Setup
// ========================
const app = express();
const port = process.env.PORT || 3000;

// EJS as template engine
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// ========================
// 3️⃣ Session Setup
// ========================
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", (error) => console.log(error));

const sessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

// Secure cookies in production
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParams.cookie.secure = true;
}

// Apply session middleware
app.use(session(sessionParams));

// ========================
// 4️⃣ Flash Middleware
// ========================
app.use(flash());

// Optional: Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
});

// ========================
// 5️⃣ Routes
// ========================

// GET /secretWord
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  res.render("secretWord", {
    secretWord: req.session.secretWord,
  });
});

// POST /secretWord
app.post("/secretWord", (req, res) => {
  const newWord = req.body.secretWord;

  if (newWord.toUpperCase()[0] === "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with P.");
  } else {
    req.session.secretWord = newWord;
    req.flash("info", "The secret word was changed.");
  }

  res.redirect("/secretWord");
});

// ========================
// 6️⃣ 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// ========================
// 7️⃣ 500 Error Handler
// ========================
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

// ========================
// 8️⃣ Start Server & Connect MongoDB
// ========================
const start = async () => {
  try {
    // Connect to MongoDB first
    await connectDB(process.env.MONGO_URI);

    // Start server
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

start();
