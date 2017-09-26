var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  //this bracket notation uses the env variable to access a property, so if env is development, it will access the development property
  var envConfig = config[env];
  //this takes all the keys in the object, and outputs them as an array
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });


}

/*if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env == 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
*/
