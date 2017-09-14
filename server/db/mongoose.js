var mongoose = require('mongoose');
//tell mongoose to use the built in promise livrary, not a third party one
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true //required in recent versions
});

module.exports = {mongoose}
