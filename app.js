var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require("express-handlebars");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require("express-validator");
// store must be after your session so you can pass your session to it
var MongoStore = require("connect-mongo")(session);

var index = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

/* Connect to MongoDB. The port is shown in the terminal after you've started the
  mongodb server (directions in evernote).
  mongoose.connect(path of server/databaseName)
  The databaseName will be created automatically if it doesn't already exist
*/
mongoose.connect('localhost:27017/shopping');
// let the config be available
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:  {maxAge: 180 * 60 * 1000} // how long should the session live before they expire: (180 mins)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


// this middleware makes login and session variables available in ALL views.
// This ensures that once the user logs in, they stay logged in until they logout.
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// the '/user' (and others except '/') goes first because it checks if the route starts with "/user"
// if the '/' was first, it would always route to '/'
app.use('/user', userRoutes);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
