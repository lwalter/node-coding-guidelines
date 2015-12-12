var express = require('express');
var router = express.Router();

var Guideline = require('../models/guidelines').Guideline;

router.get('/', function(req, res, next) {
  Guideline.find({}, function (err, guidelines) {
    res.render('index', { title: 'Coding guidelines', guidelines: guidelines });
  });
  //res.render('index', { title: 'Coding guidelines' });
});

module.exports = router;
