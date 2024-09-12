if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./init/models/user.js");

//const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';  // process.env.ATLASDB_URL || Use local DB as fallback for development
const dbUrl =   process.env.ATLASDB_URL
async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to Database");
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET || 'thisshouldbeabettersecret',  // Use a default secret for development
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });

    let registeredUser = await User.register(fakeUser, "helloWorld");
    res.send(registeredUser);
});

app.use("/", listingsRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
    console.error('------------Error--------', err);
    res.status(500).send(`Something went wrong because of: ${err.message}`);
});

const port = process.env.PORT || 8080;  // Use environment variable PORT or default to 8081

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
