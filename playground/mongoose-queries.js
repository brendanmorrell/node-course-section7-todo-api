const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo.js');
const {User} =require('./../server/models/user.js')

var id = '59bae78800d97624af8d945d11'


/*if(!ObjectID.isValid(id)){
  return console.log('ID is not valid');
}

//this will return an array
Todo.find({
  _id: id//mongoose automatically converts the string to an ObjectID
}).then ((todos) => {
  if(todos[0] === undefined){
    return console.log('Id not found')
  }
  console.log('todos', todos);
});

//this will return an object
Todo.findOne({
  _id: id//mongoose automatically converts the string to an ObjectID
}).then ((todo) => {
  if(!todo){
    return console.log('Id not found')
  }
  console.log('todo', todo);
});

//this will also return an object
Todo.findById(id).then((res) => {
  if(!res){
    return console.log('Id not found');
  }
  console.log('todo', res)
});*/

//challenge: do the same thing with User
var id = '59bad913a7ddf5184747bb99'

if(!ObjectID.isValid(id)){
  console.log('ID is invalid')
};
User.findById(id).then( (user) => {
  if(!user){
    return console.log('User not found')
  };
  console.log('User: ',JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
