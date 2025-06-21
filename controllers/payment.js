// controllers/payment.js

exports.renderCheckoutPage = async (req, res) => {
  const { clientSecret, listingId } = req.query;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  res.render("payments/checkout", {
    clientSecret,
    listing,
  });
};
