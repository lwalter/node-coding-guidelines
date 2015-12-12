function userLoggedIn(req, res, next) {
  var isLoggedIn = req.isAuthenticated();
  res.locals.userLoggedIn = isLoggedIn;

  if (isLoggedIn) {
    res.locals.firstname = req.user.firstname;
  }

  next();
}

function userIsAdmin(req, res, next) {
  res.locals.userIsAdmin = req.isAuthenticated() && req.user.isAdmin;
  next();
}

function redirectIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');//, { title: 'Login', errorMsg: 'You must be logged in to do that' });
  }

  next();
}

function ensureIsAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }

  if (!req.user.isAdmin) {
    // 403
    return res.redirect('/');
  }

  next();
}

module.exports = {
  authentication: {
    userLoggedIn: userLoggedIn,
    ensureLoggedIn: ensureLoggedIn,
    redirectIfLoggedIn: redirectIfLoggedIn,
    ensureIsAdmin: ensureIsAdmin,
    userIsAdmin: userIsAdmin
  }
};
