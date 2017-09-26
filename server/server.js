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


app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id

  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator:req.user._id}).then((todos) => {
    res.send(todos);//could pass in todos instead of an object, but if you do this, you can't chain functions on it because it is an array instead of an object
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send(`Error: Id ${id}  is not a valid ObjectID`);
  }
  Todo.findOne({_id: id,
    _creator:req.user._id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send(`Error: No todo found with id: ${id}`);
    };
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send(`Error: Id ${id}  is not a valid ObjectID`);
  };
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((result) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  //we only want some of the body properties to be updateable (the ones that we assigned to the object, and are defined by the user, so not something like completedAT). lodash's .pick does this. you pass in the object as the first argument, and then an array with the properties you want to grab out
  //this basically takes what the user gives us and picks out only what we want them to be able to update
  var body = _.pick(req.body, ['text', 'completed']);

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
  //put in id, then use the mongodb operator to define what you want to do (set), then put the new body in as the object that you will be setting elements of, and then the last argument is a few options you can define. in this case, we want to return the new object that we set, not the object before the changes, so we set new to true
  Todo.findOneAndUpdate({_id:id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send(`Error: No todo found with id: ${id}`);
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//My Own Stuff
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body)

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    //headers take key value pairs. those beginning with x- mean custom header (not necessarilly recognized by http)
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e);
  });
});


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
    res.status(200).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})


app.delete('/users/me/token',authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send(req.user);
  }, () => {
    res.status(400).send();
  });
});





app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
