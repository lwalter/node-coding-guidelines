var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var GuidelineCategory = require('../models/guideline-category').GuidelineCategory;
var Guideline = require('../models/guidelines').Guideline;
var localMiddleware = require('../middleware/middleware');

router.get('/create', localMiddleware.authentication.ensureIsAdmin,  function(req, res, next) {
  GuidelineCategory.find({}, 'title', function (err, categories) {
    if (err) {
      console.log('Error querying guideline categories');
    }

    res.render('guideline-categories/new-guideline-category', { title: 'Create a new guideline category', categories: categories });
  });
});

router.post('/create', localMiddleware.authentication.ensureIsAdmin, function(req, res, next) {
  var newGuidelineCategory = new GuidelineCategory({
    title: req.body.title,
    parentCategory: !!req.body.parentCategory ? mongoose.Types.ObjectId(req.body.parentCategory) : null,
    createdBy: req.user._id
  });


  newGuidelineCategory.save(function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect('/');
  });
});

router.get('/', localMiddleware.authentication.ensureIsAdmin, function(req, res, next) {
  GuidelineCategory.find({}, 'title parentCategory level', function (err, categories) {
    if (err) {
      console.log('Error querying guideline categories');
    }

    res.render('guideline-categories/all-categories', { title: 'Guideline categories', categories: categories });
  });
});


// TODO(lnw) ensure that error'd queries are handled correctly.
router.get('/delete/:id', localMiddleware.authentication.ensureIsAdmin, function(req, res, next) {
  // If any guidelines reference this, restrict deletion
  Guideline.findOne({ parentCategory: req.params.id }, function (err, guideline) {
    if (err) {
      console.log('Error querying guideline');
      return next(err);
    }

    if (guideline) {
      // Cannot delete category
      console.log('Guidelines reference this, cannot delete.');
      return next(err);
    }

    GuidelineCategory.remove({ _id: req.params.id }, function (err) {
      if (err) {
        console.log('Error deleting guideline category/');
        return next(err);
      }

      res.redirect('/');
    });
  });
});

module.exports = router;
