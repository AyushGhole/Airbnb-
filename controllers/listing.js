const Listing = require("../models/listing");

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
