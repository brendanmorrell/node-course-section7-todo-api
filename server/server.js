var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} =require('mongodb')
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
//this sets this variable such that it will be set if the app is running on heroku but won't be set if mongo is running locally
const port = process.env.PORT || 3000;




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

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('error. user id is not valid Object ID');
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Error. User id is not valid ObjectID');
  };
  Todo.findByIdAndRemove(id).then((result) => {
    if (!result) {
      return res.status(404).send(`Error: No todo found with id: ${id}`);
    }
    res.status(200).send({result});
  }).catch((e) => {
    res.status(400).send(e);
  });
})

app.delete('/todos', (req, res) => {
  Todo.remove({}).then((result) => {
    if (!result){
      return res.status(404).send('Error');
    }
    res.status(200).send({result});
  }).catch((e) => {
    res.status(400).send(e)
  });
});

app.get('/users', (req, res) =>{
  User.find().then( (users) => {
    res.send({users});
  }, (e) => {
    res.status(400).send(e);
  });
});



app.get('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Error. User ID invalid');
  }
  User.findById(id).then((user) => {
    if(!user){
      return res.status(404).send('User id not found in database');
    }
    res.send({user});
  }).catch((e) => {
    res.status(400).send(e);
  });
});



app.delete('/users', (req, res) => {
  User.remove({}).then((result) => {
    if(!result){
      return res.status(404).send('Error');
    }
    res.status(200).send({result});
  }).catch((e) =>{
    res.status(400).send(e);
  });
});


app.delete('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Error. id is not a valid ObjectID');
  }
  User.findByIdAndRemove(id).then((result) => {
    if(!result){
      res.status(404).send(`Error. user id '${id}' not found`);
    }
    res.status(200).send({result});
  }).catch((e) => {
    res.status(400).send(`Error: ${e}`);
  });
});

//valid todo id= 59bae78800d97624af8d945e

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
