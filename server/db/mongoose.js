var mongoose = require('mongoose');
//tell mongoose to use the built in promise livrary, not a third party one
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true //required in recent versions
});

module.exports = {mongoose}
