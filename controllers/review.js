const Listing = require("../models/listing");
const Review = require("../models/review");

//Reviews Route
module.exports.reviewRoute = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  console.log("listing object :", listing);

  let newReviews = new Review(req.body.review);
  newReviews.author = req.user._id;

  console.log("reiviews object : ", newReviews);
  listing.reviews.push(newReviews);

  await newReviews.save();
  await listing.save();

  req.flash("success", `New Reiview Created!!`);
  console.log("New review saved");
  res.redirect(`/listing/${req.params.id}`);
};

//Delete Route
module.exports.deleteRoute = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log("id : ", id);
  console.log("review : ", reviewId);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", `Review Deleted!!`);
  res.redirect(`/listing`);
};
