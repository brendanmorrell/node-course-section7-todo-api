var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
//have express configure middleware (bodyparser in this instance)
app.use(bodyParser.json())//this json method on body parser returns a function that is the middleware, and that is what we give to express. now we can send json to our express app




app.post('/users', (req, res) => {
  var user = new User({
    email: req.body.email
  });
  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

var port=3000
app.listen(port, () => {
  console.log('Started on port 3000')
});


module.exports = {app};
