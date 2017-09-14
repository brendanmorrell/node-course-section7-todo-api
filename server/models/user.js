var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: [true, 'Please enter a valid email'],
    trim: true,
    minlength:[6, 'Emails must be at least 6 characters long']
  }
});


module.exports = {User};


































































/*
var newUser = new User({
  email: 'brendanmorrell@gmail.com'
});

newUser.save().then((doc) => {
  console.log('New user successfully added to the database');
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Error saving new user.', e.errors.email.message);
});
*/
