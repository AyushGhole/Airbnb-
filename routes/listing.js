const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Declaring from the Controllers
const listingControllers = require("../controllers/listing.js");
const paymentController = require("../controllers/payment.js");

// New route: Display form for new listing
router.get("/new", isLoggedIn, listingControllers.renderNewRoute);

router
  .route("/")
  .get(listingControllers.index)
  .post(upload.single("image"), listingControllers.createRoute);

router
  .route("/:id")
  .get(listingControllers.showRoute)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    listingControllers.updateRoute
  )
  .delete(isLoggedIn, isOwner, listingControllers.deleteRoute);

// // Index route: Display all listings
// router.get("/", listingControllers.index);

// Show route: Display details of a specific listing
// router.get("/:id", listingControllers.showRoute);

// Create route: Add a new listing
// router.post("/", listingControllers.createRoute);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.editRoute);

//Update route
// router.put("/:id", isLoggedIn, isOwner, listingControllers.updateRoute);

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, listingControllers.deleteRoute);

// POST: Book a listing
router.post("/:id/book", isLoggedIn, listingControllers.bookListing);

// payment /Checkout
router.get("/payment/checkout", paymentController.renderCheckoutPage);

module.exports = router;
