const User = require("../models/user");

// Signup route
module.exports.signUpRoute = (req, res) => {
  res.render("signup.ejs");
};

// Signup Router post one
module.exports.signUpPostRouter = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "User created successfully!!Please login");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// login route
module.exports.loginRoute = (req, res) => {
  res.render("login.ejs");
};

// Login router post
module.exports.loginRouterPost = (req, res) => {
  req.flash("success", "Welcome back to Wonderlust!!");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

// Logout route
module.exports.logOutRoute = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You logged out successfully!!");
      res.redirect("/listing");
    }
  });
};
