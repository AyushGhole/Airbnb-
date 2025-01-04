// .env file access
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLAS_URL;

// Declaring the required npm packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// Routers folder requirement
const user = require("./routes/user.js");
const routes = require("./routes/listing.js");
const { isLoggedIn, isReviewAuthor } = require("./middleware.js");
const reviewControllers = require("./controllers/review.js");

// MongoStore code declarations
const Store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

Store.on("error", () => {
  console.log("Error in MongoDb sessions store", url);
});

// Sessions express-sessions function code
const sessionOptions = {
  Store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
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

// MongoDB Connection

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

// Routes
// Home route
// app.get("/", (req, res) => {
//   res.send("I am the root ..");
// });

// Router declaration
app.use("/", user);
app.use("/listing/", routes);

// // Index route: Display all listings
// app.get("/listing", async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("index.ejs", { allListings });
// });

// // New route: Display form for new listing
// app.get("/listing/new", isLoggedIn, (req, res) => {
//   console.log(req.user);
//   res.render("new.ejs");
// });

// // Show route: Display details of a specific listing
// app.get("/listing/:id", async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   console.log(listing);
//   if (!listing) {
//     req.flash("error", "Listing Does Not Existed!!!");
//     res.redirect("./listing");
//   }
//   res.render("show.ejs", { listing });
// });

// // // Create route: Add a new listing
// app.post("/listing", isLoggedIn, async (req, res) => {
//   try {
//     const newListing = new Listing(req.body);
//     await newListing.save();
//     console.log(newListing);
//     req.flash("success", `New Listing Created!!`);
//     res.redirect("/listing"); // Redirect to all listings after adding
//   } catch (err) {
//     console.error("Error saving listing:", err);
//     res.status(500).send("Error saving listing");
//   }
// });

// //Edit Route
// app.get("/listing/:id/edit", isLoggedIn, async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listing Does Not Existed!!!");
//     res.redirect("./listing");
//   }
//   req.flash("success", `Listing Edited Successfully!!`);
//   res.render("edit.ejs", { listing });
// });

// //Update route
// app.put("/listing/:id", async (req, res) => {
//   const { id } = req.params;
//   let edit = await Listing.findByIdAndUpdate(id, { ...req.body });
//   console.log(edit);
//   req.flash("success", `Listing Updated!!`);
//   res.redirect("/listing");
// });

// //Delete Route
// app.delete("/listing/:id", isLoggedIn, async (req, res) => {
//   const { id } = req.params;
//   let deleteRoute = await Listing.findByIdAndDelete(id);
//   console.log(deleteRoute);
//   req.flash("success", `Listing Deleted!!`);
//   res.redirect("/listing");
// });

// // Validate Listing
// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(" , ");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

//Reviews Route
app.post("/listing/:id/reviews", isLoggedIn, reviewControllers.reviewRoute);

//Delete Route
app.delete(
  "/listing/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewControllers.deleteRoute
);

// Server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
