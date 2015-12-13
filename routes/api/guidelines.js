var express = require('express');
var router = express.Router();

var Guideline = require('../../models/guidelines').Guideline;
var localMiddleware = require('../../middleware/middleware');

router.get('/', function (req, res, next) {
  Guideline.find({}, function (err, guidelines) {
    res.json(guidelines);
  });
});

module.exports = router;
