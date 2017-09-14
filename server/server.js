var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} =require('mongodb')
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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos:todos});//could pass in todos instead of an object, but if you do this, you can't chain functions on it because it is an array instead of an object
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:todoid', (req, res) => {
  var id = req.params.todoid;

  if(!ObjectID.isValid(id)){
    return res.status(402).send('error');
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send('user id not found');
    };
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.get('/users', (req, res) =>{
  User.find().then( (users) => {
    res.send({users});
  }, (e) => {
    res.status(400).send(e);
  });
});

//valid todo id= 59bae78800d97624af8d945e

var port=3000
app.listen(port, () => {
  console.log('Started on port 3000')
});

module.exports = {app};
