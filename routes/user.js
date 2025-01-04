const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/user");

router
  .route("/signup")
  .get(userControllers.signUpRoute)
  .post(userControllers.signUpPostRouter);

router
  .route("/login")
  .get(userControllers.loginRoute)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.loginRouterPost
  );

// // Signup route
// router.get("/signup", userControllers.signUpRoute);

// // Signup Router
// router.post("/signup", userControllers.signUpPostRouter);

// // Login Router
// router.post(
//   "/login",
//   savedRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userControllers.loginRouterPost
// );

// Logout route
router.get("/logout", userControllers.logOutRoute);

module.exports = router;
