                              //method within mongo
//const MongoClient = require('mongodb').MongoClient;

var {MongoClient, ObjectID} = require('mongodb');
//  object destructuring tutorial. grab 'name' in the object and turn it into a variable'
/*var user = {name: 'andrew', age: 25};
var {name} = user; //grab the variable in curly braces and put the object you want it destructured from after the equals
console.log(name);
console.log(user);*/

//this was just an example. code not actually necessary
/*var obj = new ObjectID();
console.log(obj);*/

//  arg1=url for database (like amz web services url or haroko url or localhost)
//  arg2=callback function that fires after connection succeeds or fails
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('There was an issue connecting to the mongoDB database server');
  }
  console.log('Successfully connected to mongoDB database server');


/* db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.collection('Users').insertOne({
    name: 'Brendan',
    usrname: 'brendanmorrell',
    password: 'Midgetofrage1'
  }, (err, result) =>{
    if(err) {
      return console.log('Error adding user to database', err);
    };
    console.log(JSON.stringify(result.ops, undefined, 2));
    //grab the timestamp by getting the id (0 in the array) and using this method
    console.log(result.ops[0]._id.getTimestamp());
  });*/

  //  closes connection with mongoDB server
  db.close();
});
