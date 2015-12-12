var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guidelineCategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'GuidelineCategory'
  },
  level: {
    type: Number,
    required: true
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

function resolveLevel(next) {
  var self = this;

  if (!self.parentCategory) {
    self.level = 0;
    return next();
  }

  GuidelineCategory.findOne({ _id: this.parentCategory }, 'level', function (err, category) {
    if (err) {
      console.log('Error querying for parent guideline category');
      next(err);
    } else if (!category) {
      console.log('Unknown parent category id');
      self.invalidate('parentCategory', 'parent category must exist');
      next(new Error('parent category must exist'));
    } else {
      self.level = category.level + 1;
      next();
    }
  });
}

guidelineCategorySchema.pre('validate', resolveLevel);

var GuidelineCategory = mongoose.model('guidelineCategories', guidelineCategorySchema);
module.exports = {
  'GuidelineCategory': GuidelineCategory,
  'GuidelineCategorySchema': guidelineCategorySchema
};
