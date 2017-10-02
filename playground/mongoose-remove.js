const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo.js');
const {User} =require('./../server/models/user.js')

//removes whatever documents match the query
//can't delete everything by passing in empty query like find does. need empty object
Todo.remove({}).then((result) => {
  console.log(result);
})


//these methods will actually return the removed document back to you, which is useful
Todo.findOneAndRemove({
   "text": "Something to do from Postman2"
}).then((todo) =>{
  console.log('todo with id 59c2e8216e745d51e64e79d0 should have been deleted');
  console.log(todo);
});

Todo.findByIdAndRemove('59c2e714a1b6f15115a4f335').then((todo) => {
  console.log(`The following Todo has been deleted: `);
  console.log(todo);
});
