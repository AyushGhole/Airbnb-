const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    console.log("first function : ", req.session.redirectUrl);
    req.flash("error", "You need to be logged in!!");
    return res.redirect("/login");
  } else {
    next();
  }
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  return next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Your don't have access to edit the listing!");
    res.redirect("/listing");
  } else {
    return next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._idid)) {
    req.flash("error", "Your not the author of the review!!");
    res.redirect("/listing");
  } else {
    return next();
  }
};
