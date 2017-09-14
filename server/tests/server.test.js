const expect = require('expect');
const supertestRequest = require('supertest');

const {app} = require('./../server.js');
const{Todo} = require('./../models/todo.js');
const{User} = require('./../models/user.js');



const todos = [{
  text: 'First test todo',
}, {
  text: 'Second test todo'
}];
//this runs code before each test case. if we expect only one todo (we expect that below), we pbviously need the database to be empty when the test starts
beforeEach((done) => {
  Todo.remove({})//this is a mongoose method, and if you pass in an empty object, it removes all of them
    .then( () => {
      return Todo.insertMany(todos)
    }).then(() => done());
});


describe('POST /todos', () =>{
  it('should create a new todo', (done) => {//done argument needs to be sent in for async tests
    var text = 'Test todo text';

    supertestRequest(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
        return  done(err);
        }

        Todo.find({text: 'Test todo text'}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));//this will get any errors that may have been thrown
      });
  });

  it('should not create a todo if the data is not a string of at least one character', (done) => {
    var noText='';   //mongoose automatically converts numbers and booleans to strings so the bottom two are unnecessary
//    var number=5;
//    var boolean=false;

    supertestRequest(app)
      .post('/todos')
      .send({text: noText})
//      .send({text: boolean})
//      .send({text: number})
      .expect(400)
      .end( (err, res) => {
        if (err){
          return done(err);
        }

        Todo.find().then((nothing) => {
          expect(nothing.length).toBe(2);
          done();
        }).catch((e) =>done(e));
      });

  })
});

describe('GET /todos', () => {
  it('Should get all the todos', (done) => {
    supertestRequest(app)
      .get('/todos')
      .expect(200)
      .expect((res)=> {
        expect(res.body.todos.length).toBe(2);
        expect(res.body.todos[0].text).toBe(todos[0].text);
        expect(res.body.todos[1].text).toBe(todos[1].text);
      }).end( (err, res) => {
        if (err){
          return done(err);
        }

        Todo.find().then((dbtodos) => {
          expect(dbtodos.length).toBe(2);
          expect(dbtodos[0].text).toBe(todos[0].text);
          expect(dbtodos[1].text).toBe(todos[1].text);
          done();
        }).catch((e) => done(e));
      })
  })
})
