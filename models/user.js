var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

var options = {
  usernameField: 'email',
  errorMessages: {
    UserExistsError: 'A user with the given email is already registered'
  }
};
userSchema.plugin(passportLocalMongoose, options);

var User = mongoose.model('users', userSchema);
module.exports = User;
