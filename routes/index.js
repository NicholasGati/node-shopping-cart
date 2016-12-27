var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require("../models/product");
var Order = require("../models/order");
/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];

  // fetches the products from database.
  Product.find(function(err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

// add item to cart
router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ?  req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

// remove one item from cart
router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ?  req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

// remove all items from cart
router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ?  req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
     return res.render('shop/shopping-cart', {products: null});
   }
   var cart = new Cart(req.session.cart);
   res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  // {stuff: stuff....} - this is how you pass the variables to the view
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }

  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_QGPJcc7chWkkZqvNeEcM4rbj"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Charge Card"
  }, function(err, charge) {
    // asynchronously called
    if (err) {
      req.falsh('error', err.message);
      return res.redirect('/checkout');
    }

    // The new order that is recorded to DB
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      if (err) {
        req.falsh('error', err.message);
        return res.redirect("/");
      }
      req.flash('success', 'Congratulation! The purchase was successful!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // continue
  }
  // store the old url so that when the user signs in, they get redirected to the route they were on initially
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

module.exports = router;
