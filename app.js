var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/coding_guidelines');

var passport = require('passport');

var localMiddleware = require('./middleware/middleware');
//var users = require('./routes/users');
//var guidelines = require('./routes/guidelines');
//var guidelineCategories = require('./routes/guideline-categories');

var app = express();

/*
var moment = require('moment');

hbs.registerHelper('formattedDate', function (date) {
  return new  hbs.SafeString(moment(date).fromNow());
});
*/

/*
// view engine setup
app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, 'public/views/partials'),
  defaultLayout: path.join(__dirname, 'public/views/layouts/defaultLayout.hbs'),
  layoutsDir: path.join(__dirname, 'public/views/layouts')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: 'use environment variable here!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(localMiddleware.authentication.userLoggedIn);
app.use(localMiddleware.authentication.userIsAdmin);

var guidelinesApi = require('./routes/api/guidelines');
app.use('/api/guidelines', guidelinesApi);

var routes = require('./routes/index');
app.use('/', routes);

//app.use('/', users);
//app.use('/guidelines', guidelines);
//app.use('/guideline-category', guidelineCategories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
