var express = require('express');
var csrf = require("csurf");
var passport = require("passport");

var Product = require("../models/product");
var router = express.Router();

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  // fetches the products from database.
  var products = Product.find(function(err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i+= chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks});
  });
});

/* GET user signup page. */
router.get('/user/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: "/user/profile",
  failureRedirect: "/user/signup",
  failureFlash: true
}));

router.get("/user/profile", function(req, res, next) {
  res.render("user/profile");
});

module.exports = router;