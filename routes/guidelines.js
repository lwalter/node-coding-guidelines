var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Guideline = require('../models/guidelines').Guideline;
var GuidelineCategory = require('../models/guideline-category').GuidelineCategory;

var localMiddleware = require('../middleware/middleware');

router.get('/create', localMiddleware.authentication.ensureIsAdmin,  function(req, res, next) {
  GuidelineCategory.find({}, 'title', function (err, categories) {
    if (err) {
      console.log('Error retrieving guideline categories');
      return next(err);
    }

    res.render('guidelines/new-guideline', { title: 'Create a new guideline', categories: categories });
  });
});

router.post('/create', localMiddleware.authentication.ensureIsAdmin, function(req, res, next) {
  GuidelineCategory.findOne({ _id: req.body.category }, function (err, category) {
    if (err) {
      console.log('Error querying chosen guideline category');
      return next(err);
    }

    if (!category) {
      console.log('Error adding guideline.');
      //TODO(lnw) redirect here??
      return next(err);
    }

    var newGuideline = new Guideline({
      title: req.body.title,
      description: req.body.description,
      codeExample: req.body.codeExample,
      category: category,
      tags: req.body.tags,
      createdBy: req.user._id
    });

    newGuideline.save(function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }

      res.redirect('/');
    });
  });
});

router.get('/:id', localMiddleware.authentication.ensureLoggedIn, function (req, res, next) {
  // TODO(lnw) Filter subdoc fields - some of the fields are filtered but not others?
  /*Guideline.findOne({ _id: req.params.id }, '_id title  description tags category.title codeExample comments', function (err, guideline) {if (err) {
      // TODO(lnw) is return next(err) what I want to do here?
      console.log('Error querying for guideline');
      return next(err);
    }

    if (!guideline) {
      console.log('No guideline exists');
      //TODO(lnw) need a real 404
      return res.status(404);
    }

    console.log('Subdocument is selecting more than wanted', !!guideline.category.createdAt);
    //console.log(guideline);

    res.render('guidelines/guideline', { title: guideline.title, guideline: guideline });
  });
  */
  Guideline
    .findOne({ _id: req.params.id })
    .select('category.title')
    .exec(function (err, guideline) {
      if (err) {
      // TODO(lnw) is return next(err) what I want to do here?
      console.log('Error querying for guideline');
      return next(err);
    }

    if (!guideline) {
      console.log('No guideline exists');
      //TODO(lnw) need a real 404
      return res.status(404);
    }

      console.log(guideline);

    res.render('guidelines/guideline', { title: guideline.title, guideline: guideline });
  });
});

router.post('/:id/comment/create', localMiddleware.authentication.ensureLoggedIn, function (req, res, next) {
  var newComment = {
    content: req.body.content,
    createdAt: new Date,
    createdBy: req.user._id
  };

  Guideline.update({ _id: req.params.id }, { $push: { comments: newComment }}, function (err, result) {
    if (err) {
      console.log(err);
      return next(err);
    }

    if (!result) {
      console.log('Error adding comment');
      //TODO(lnw) redirect here??
      return next(err);
    }
  });

  res.redirect('/');
  //res.render('guidelins/guideline', { title: result, guideline: guideline });
});

router.get('/delete/:id', localMiddleware.authentication.ensureIsAdmin, function (req, res, next) {
  console.log(req.params.id);
  Guideline.remove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
      return next(err);
    }

    res.redirect('/');
  });
});

module.exports = router;
