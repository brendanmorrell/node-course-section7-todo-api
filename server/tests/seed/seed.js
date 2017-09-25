const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email:'brendan@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id:userOneId, access: 'auth'}, 'hashsalt').toString()
    }]
},   {
    _id: userTwoId,
    email: 'jen@example.com',
    password:'userTwoPass'
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
      return Todo.insertMany(todos)
    }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
//this sets it such that the then call only runs after both promises have finished and returned, which we do when save() executes, and by calling save(), we run the middle ware we created
    return Promise.all[userOne, userTwo]
  }).then(() => done());
};

module.exports = {todos, users, populateTodos, populateUsers}