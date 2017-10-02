require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} =require('mongodb')
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

//have express configure middleware (bodyparser in this instance)
app.use(bodyParser.json());//this json method on body parser returns a function that is the middleware, and that is what we give to express. now we can send json to our express app


app.post('/todos', authenticate, async (req, res) => {
  try {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id

  });
    const doc = await todo.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {
    const todo = await Todo.find({_creator:req.user._id});
    res.send(todo);//could pass in todos instead of an object, but if you do this, you can't chain functions on it because it is an array instead of an object
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos/:id', authenticate, async (req, res) => {

  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send(`Error: Id ${id}  is not a valid ObjectID`);
  }
  try {
    const todo = await Todo.findOne({_id: id,
      _creator:req.user._id
    });
    if(!todo){
      return res.status(404).send(`Error: No todo found with id: ${id}`);
    };
    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send(`Error: Id ${id}  is not a valid ObjectID`);
  };
  try {
    result = await Todo.findOneAndRemove({
      _id:id,
      _creator: req.user._id
    });

    if (!result) {
      return res.status(404).send(`Error: No todo found with id: ${id}`);
    }
    res.status(200).send({result});
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/todos', async (req, res) => {
  try {
    const result = Todo.remove({});
    if (!todo){
      return res.status(404).send('Error');
    }
    res.status(200).send({todo});
  } catch (e) {
    res.status(400).send(e)
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  //we only want some of the body properties to be updateable (the ones that we assigned to the object, and are defined by the user, so not something like completedAT). lodash's .pick does this. you pass in the object as the first argument, and then an array with the properties you want to grab out
  //this basically takes what the user gives us and picks out only what we want them to be able to update
  const  body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send(`Error: Id ${id}  is not a valid ObjectID`)
  }

  if(_.isBoolean(body.completed) && body.completed) {
    //if it is a boolean and it's true
    body.completedAt = new Date().getTime();
  } else {
    //if it isn't a boolean or it is false
    body.completed = false;
    body.completedAt = null;
  }
  try {
    //put in id, then use the mongodb operator to define what you want to do (set), then put the new body in as the object that you will be setting elements of, and then the last argument is a few options you can define. in this case, we want to return the new object that we set, not the object before the changes, so we set new to true
    const todo = await Todo.findOneAndUpdate({_id:id, _creator: req.user._id}, {$set: body}, {new: true});
    if(!todo){
      return res.status(404).send(`Error: No todo found with id: ${id}`);
    };
    res.send({todo});
  } catch (e) {
    res.status(400).send(e);
  };
});

//My Own Stuff
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body)
    await user.save()
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send(e);
  }
});



app.post('/users/login', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    var user = await User.findByCredentials(body.email, body.password);
    var token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send(e);
  }
});


app.get('/users/me', authenticate, async (req, res) => {
  try {
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  };
});


app.delete('/users/me/token',authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token)
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});





app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
