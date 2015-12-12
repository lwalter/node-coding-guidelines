var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = require('../models/comment').CommentSchema;
var GuidelineCategorySchema = require('../models/guideline-category').GuidelineCategorySchema;

var guidelineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: GuidelineCategorySchema,
    required: true
  },
  codeExample: {
    type: String
  },
  tags: {
    type: [String],
    required: true,
    default: []
  },
  comments: {
    type: [CommentSchema],
    default: []
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: [Date],
    default: []
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
});


var Guideline = mongoose.model('guidelines', guidelineSchema);
module.exports = {
  Guideline: Guideline
};
