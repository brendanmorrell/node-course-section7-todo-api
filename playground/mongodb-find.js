var {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('There was an issue connecting to the mongoDB database server');
  }
  console.log('Successfully connected to mongoDB database server');

//find returns a mongo cursor, then you call a method on it, like toArray, which returns a promise
/*  db.collection('Todos').find({
    _id:new ObjectID('59b8746a49cd5967f28a2d12')
  }).toArray().then((docs) => {
    console.log('Todos:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) =>{
    console.log('unable to fetch todos', err)
  });

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos Count: ${count}`);
  }, (err) => {
    console.log('Error counting docs', err);
  });*/



//see why this returns the error even when it doesn't exist when i try to substitute this function variable
/*  var errorFunc = (err) => {
    console.log('Error:', err)
  };*/



//my own stupid function that finds a name,counts the number of times it appears, and then changes every name to brendan
  db.collection('Users').find({
    name: 'Jen'
  }).toArray().then((returnedCursor) => {
      console.log(returnedCursor);
    }, (err) => {
      console.log('Error:', err)
    });

  db.collection('Users').find({
    name: 'Jen'
  }).count().then((count) =>{
    console.log(count);
  }, (err) => {
    console.log('Error:', err)
  })

  db.collection('Users').find().toArray().then((docs) => {
    for(i=0; i<docs.length;i++){
      if(docs[i].name !== 'Brendan') {
        docs[i].name = 'Brendan';
      };
    };
    return(docs)
  }, (err) => {
    console.log('error', err);
  }).then((docs) =>{
    console.log(docs);
  });



  db.close();

});
