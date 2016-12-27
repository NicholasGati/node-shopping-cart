var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;

// passport configuration - serialize and deserialize the password
passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// USER SIGNUP
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  // validate
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4});
  var errors = req.validationErrors();

  // If there are any validation errors when signing up
  if (errors) {
    var messages = [];
    errors.forEach(function(err) {
      messages.push(err.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email': email}, function(err, user) {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, false, {message: 'Email is already in use.'});
    }

    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));

// USER SIGNIN
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  // validate
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    var messages = [];
    errors.forEach(function(err) {
      messages.push(err.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email': email}, function(err, user) {
    if (err) {
      return done(err);
    }

    // If there is no user found
    if (!user) {
      return done(null, false, {message: 'No user found'});
    }

    // if password is Invalid
    if (!user.validPassword(password)) {
      return done(null, false, {message: 'Wrong password.'});
    }

    // if password and email are correct and match
    return done(null, user);
  });
}));
