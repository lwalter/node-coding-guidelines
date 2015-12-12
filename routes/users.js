var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var router = express.Router();
var localMiddleware = require('../middleware/middleware');

router.get('/register', localMiddleware.authentication.redirectIfLoggedIn, function (req, res, next) {
  res.render('authentication/register', { title: 'Register' });
});

router.post('/register', function (req, res, next) {
  var newUser = new User({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log('Error registering', err);
      return res.render('authentication/register', { title: 'Register', errorMsg: err.message });
    }

    passport.authenticate('local', function (err, user, options) {
      if (err) {
        console.log('Error authenticating after registering', err);
        next(err);
      }

      if (!user) {
        return res.render('authentication/register', { title: 'Register', errorMsg: options.message });
      }

      req.login(user, function (err) {
        return res.redirect('/');
      });
    })(req, res, next);
  });
});

router.get('/login', localMiddleware.authentication.redirectIfLoggedIn, function (req, res, next) {
  res.render('authentication/login', { title: 'Login' });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, options) {
    if (err) {
      console.log('Error authenticating after registering', err);
      next(err);
    }

    if (!user) {
      return res.render('authentication/login', { title: 'Login', errorMsg: options.message });
    }

    req.login(user, function (err) {
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', localMiddleware.authentication.ensureLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/users', localMiddleware.authentication.ensureIsAdmin, function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      console.log('Error querying the users', err);
      return next(err);
    }

    res.render('users/all-users', { title: 'Users', users: users });
  });
});

module.exports = router;
