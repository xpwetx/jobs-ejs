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

// App setup
const app = express();
const port = process.env.PORT || 3000;

// EJS as template engine
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
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

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/secretWord", auth, secretWordRouter);
app.use("/", require("./routes/sessionRoutes"));


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
