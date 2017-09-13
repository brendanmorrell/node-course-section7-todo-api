var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Error: ', err)
  }
  console.log('connected to mongodb server');
//  findOneAndUpdate for 'Eat lunch'  **note that you need to use mongodb operators to show how to update, and that for them, you put the new info in another nested object.
//also note that by defualt it returns the original object, so if you want the updated one, you need to set returnOrignal to false
/*  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("59b988bf49cd5967f28a4663")
  }, {
    $set:{
      text: `don't you dare eat lunch muthafucka!!!!!`
    }
  }, {
    returnOriginal: false
  }).then((results) => {
    console.log(results)
  });
*/

db.collection('Users').findOneAndUpdate({
  name: 'Jen'
},{
  $set: {name: 'Jen'},
  $inc:{age: -5}
}, {
  returnOriginal: false,
}).then((results) => {
  console.log(results)
});
;


//personal challenge: do something with the options in terms of what happens if there are multiple results
  db.close();
})
