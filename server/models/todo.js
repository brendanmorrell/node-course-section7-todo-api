var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: [true, 'Todo items must be have titles'],
    minlength: [1, `Todo items' titles must be at least one character long excluding spaces`],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Todo};




















































/*
//Create new Todo
var newTodo = new Todo({
  text: 'ladida',
  completed: true,
  completedAt:11
});
newTodo.save().then((doc) => {
  console.log('Todo saved successfully');
  console.log('Todo: ', JSON.stringify(doc, undefined, 2));
}, (e) =>{
  console.log('Unable to save todo', e.errors.text.message);
});
*/
