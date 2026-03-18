// imports
const express = require("express");
require("dotenv").config();
require("express-async-errors");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const passportInit = require("./config/passport");

const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");

// Mongo connection helper
const connectDB = require("./db/connect");

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}

// App setup
const app = express();
const port = process.env.PORT || 3000;

// EJS as template engine
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
const store = new MongoDBStore({
  uri: mongoURL,
  collection: "mySessions",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false, sameSite: "strict" },
  })
);

// Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Flash and locals
app.use(flash());
app.use(require("./middleware/storeLocals"));

// test
app.use((req, res, next) => {
  if (req.path === "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/secretWord", auth, secretWordRouter);
app.use("/", require("./routes/sessionRoutes"));

app.get("/multiply", (req, res) => {
  let first = Number(req.query.first);
  let second = Number(req.query.second);
  let result = first * second;

  if (isNaN(result)) {
    result = "NaN";
  } else if (result === null) {
    result = "null";
  }

  res.json({ result });
});

// 404
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// 500
app.use((err, _req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// Start server/connect mongoDb
const start = async () => {
  try {
    await connectDB(mongoURL); // wait for MongoDB connection
    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => console.log(`Server running on ${port}...`));
    } else {
      console.log("Server running for Puppeteer tests (test mode)");
    }
  } catch (error) {
    console.error(error);
  }
};

start();
module.exports = { app };
