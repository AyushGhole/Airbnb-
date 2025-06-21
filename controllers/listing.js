const Listing = require("../models/listing");
const Booking = require("../models/booking");
const stripe = require("../utils/stripe");

// Declaring from the Controllers
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

// Index route: Display all listings
module.exports.renderNewRoute = (req, res) => {
  console.log(req.user);
  res.render("new.ejs");
};

// Show route: Display details of a specific listing
module.exports.showRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(listing);
  res.render("show.ejs", { listing });
};

// Create route: Add a new listing
module.exports.createRoute = async (req, res) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body);
    console.log(req.user);
    newListing.owner = req.user;
    newListing.image = { url, filename };
    await newListing.save();
    console.log(newListing);
    res.redirect("/listing"); // Redirect to all listings after adding
  } catch (err) {
    console.error("Error saving listing:", err);
    res.status(500).send("Error saving listing");
  }
};

//Edit Route
module.exports.editRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
};

//Update route
module.exports.updateRoute = async (req, res) => {
  const { id } = req.params;
  let edit = await Listing.findByIdAndUpdate(id, { ...req.body });
  if (typeof req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log("url : ", url, " --- ", "filename :", filename);
    edit.image = { url, filename };
    await edit.save();
  }
  // console.log("Edited", " --- ", edit);
  req.flash("success", "Listing Updated Successfully!!");
  res.redirect("/listing");
};

//Delete Route
module.exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  let deleteRoute = await Listing.findByIdAndDelete(id);
  console.log(deleteRoute);
  res.redirect("/listing");
};

// Stripe Booking
module.exports.bookListing = async (req, res) => {
  const { id } = req.params;
  const { bookingDate } = req.body;

  const listing = await Listing.findById(id);
  const amountInPaise = listing.price * 100;

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: "inr",
    metadata: { listingId: id },
  });

  // Save the booking in the DB
  const booking = new Booking({
    listing: id,
    user: req.user._id,
    bookingDate,
    price: listing.price,
    paymentIntentId: paymentIntent.id,
  });

  await booking.save();

  // Redirect to frontend payment page (could be EJS or React)
  res.redirect(
    `/payment/checkout?clientSecret=${paymentIntent.client_secret}&listingId=${listing._id}`
  );
};
