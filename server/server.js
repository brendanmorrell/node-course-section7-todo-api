require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} =require('mongodb')
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');

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




app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //we only want some of the body properties to be updateable (the ones that we assigned to the object, and are defined by the user, so not something like completedAT). lodash's .pick does this. you pass in the object as the first argument, and then an array with the properties you want to grab out
  //this basically takes what the user gives us and picks out only what we want them to be able to update
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)){
    return res.status(404).send('Error. id is not a valid ObjectID')
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
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send('No matching todo found in the database');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  })
});


app.patch('/users/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['email']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send('Error. id is not a valid ObjectID');
  }

  User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
    if(!user){
      return res.status(404).send('No matching user id found in database');
    }
    res.status(200).send({user});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};
