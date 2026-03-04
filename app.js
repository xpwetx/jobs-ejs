// imports
const express = require("express");
require("dotenv").config();
require("express-async-errors");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const passport = require("passport");
const bcrypt = require("bcrypt");

// Security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// Custom modules
const passportInit = require("./passport/passportInit");
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
const jobsRouter = require("./routes/jobs");
const sessionRouter = require("./routes/sessionRoutes");

// Mongo connection helper
const connectDB = require("./db/connect");
const User = require("./models/User");

// App setup
const app = express();
const port = process.env.PORT || 3000;

// ===== MIDDLEWARE ===== //

// Security
app.use(helmet());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie parser (must come before CSRF)
app.use(cookieParser(process.env.SESSION_SECRET));

// Force HTTP in development (localhost)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    // If the request is https, redirect to http
    if (req.secure) {
      const url = `http://${req.headers.host}${req.url}`;
      return res.redirect(url);
    }
    next();
  });
}

// Session setup
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false },
  })
);

// Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Flash 
app.use(flash());

// CSRF protection (must come after cookie + body parser)
app.use(csurf({ cookie: true }));

// Make CSRF token available to all EJS templates
app.use((req, res, next) => {
  res.locals._csrf = req.csrfToken();
  res.locals.user = req.user || null;
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  next();
});

// EJS as template engine
app.set("view engine", "ejs");

// ===== ROUTES ===== //

// Registration
app.get("/register", (req, res) => res.render("register", { errors: [] }));

app.post("/register", async (req, res) => {
  const { name, email, password, password1 } = req.body;
  const errors = [];
  if (!name || !email || !password || !password1) errors.push("All fields required");
  if (password !== password1) errors.push("Passwords do not match");
  if (errors.length > 0) return res.render("register", { errors });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push("Email already in use");
      return res.render("register", { errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    req.flash("info", "Registration successful! Log in now.");
    res.redirect("/sessions/login");
  } catch (err) {
    console.error(err);
    errors.push("Something went wrong.");
    res.render("register", { errors });
  }
});


// Sessions
app.use("/sessions", sessionRouter);

// Protected routes
app.use("/secretWord", auth, secretWordRouter);
app.use("/jobs", auth, jobsRouter)

// Home
app.get("/", (req, res) => {
  res.render("index"); 
});

// 404
app.use((req, res) => res.status(404).send(`Page ${req.url} not found.`));

// 500
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// ===== Start server/connect mongoDb ==== // 
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

start();
