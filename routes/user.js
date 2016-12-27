var express = require('express');
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");

var csrfProtection = csrf();
router.use(csrfProtection);

var Order = require("../models/order");
var Cart = require("../models/cart");

/* GET user profile page. */
router.get("/profile", isLoggedIn, function(req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
      return res.write("Error!");
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render("user/profile", {orders: orders});
  });
});

/* GET user LOGOUT page. */
router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

// This is a middleware that is in front of all other routes to make sure user is NOT logged in.
// If you need to know user IS logged in, like '/profile' and /logout above, then you must place that code
// above this code in order for it to work properly.
router.use('/', isNotLoggedIn, function(req, res, next) {
  next();
});

/* GET user signup page. */
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

/* POST user signup (create a new user) with local signup strategy in passport.js. */
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: "/user/profile",
  failureRedirect: "/user/signup",
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    // clear old url so that the user isn't redirected to the oldurl forever!
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

/* GET user signin page. */
router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

/* POST user signin with local signin strategy in passport.js. */
router.post("/signin", passport.authenticate('local.signin', {
  failureRedirect: "/user/signin",
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

// CUSTOM MIDDLEWARE: Checks if request is authenticated and user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // continue
  }
  res.redirect('/');
}

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(); // continue
  }
  res.redirect('/');
}

module.exports = router;
