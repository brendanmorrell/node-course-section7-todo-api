const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, returnedDB) => {
  if (err) {
    return console.log('Error connceting to mongodb server');
  }
  console.log('connection established with mongodb server')



//  deleteMany
/*  returnedDB.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('Error:', err);
  });*/

// deleteOne (deletes first item it finds, and then stops)
/*  returnedDB.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    console.log(result);
    console.log(`number of items deleted: ${result.result.n}`)
  });*/

//findOneAndDelete (gives you the data back)
/*  returnedDB.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  });*/

  //Challenge: Delete all the duplicates ('Brendan') and grab a specific one to delete
  
 returnedDB.collection('Users').deleteMany({name: 'Brendan'}).then((results) => {
    console.log(`Number of deleted users: ${results.result.n}`);
  })*/

  returnedDB.collection('Users').findOneAndDelete({_id: new ObjectID("59b98f9449cd5967f28a475a")}).then((results) => {
    console.log(results);
    console.log(`Deleted File:`)
    console.log(JSON.stringify(results.value, undefined, 2));
  });



  returnedDB.close();
});
