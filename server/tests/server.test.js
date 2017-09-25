const _ = require('lodash');
const expect = require('expect');
const supertestRequest = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const{Todo} = require('./../models/todo.js');
const{User} = require('./../models/user.js');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todos and GET /todos/:id', () => {
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
        };

        Todo.find().then((dbtodos) => {
          expect(dbtodos.length).toBe(2);
          expect(dbtodos[0].text).toBe(todos[0].text);
          expect(dbtodos[1].text).toBe(todos[1].text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return the todo doc', (done) => {
    supertestRequest(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
        expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
      }).end(done);
    });

    it('should return a 404 if todo not found', (done) => {
      supertestRequest(app)
        .get(`/todos/${(new ObjectID).toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return a 404 if object ID is not valid', (done) => {
      supertestRequest(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });

});


describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    supertestRequest(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect( (res) => {
        expect(res.body.result._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((res) =>{
          expect(res).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    supertestRequest(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if objectID is invalid', (done) => {
    var hexId = 111

    supertestRequest(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/:id', () => {
  it('should patch the todo info', (done) => {
    var oldBody = todos[0];
    var newBody = {
      text: "new text",
      completed: true
    };
    var hexId = todos[0]._id.toHexString();
    supertestRequest(app)
      .patch(`/todos/${hexId}`)
      .send(newBody)
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo.text).toBe(newBody.text);
        expect(resp.body.todo.completed).toBe(newBody.completed);
        expect(resp.body.todo.completedAt).toBeA('number');
      }).end( (err, resp) => {
          if (err) {
            return done(err);
          }
          Todo.find({
            text: oldBody.text,
            completed: oldBody.completed
          }).then((res) => {
            expect(res.text && res.completed).toNotExist();
            done();
          }).catch( (e) => {
            return done(e);
          })
    });
  });



  it('should clear completedAtwhen todo is not completed', (done) => {
    var newBody = {
      text:'booblybobblywobble',
      completed:false
    };
    var hexId = todos[1]._id.toHexString();

    supertestRequest(app)
      .patch(`/todos/${hexId}`)
      .send(newBody)
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo.text).toBe(newBody.text);
        expect(resp.body.todo.completedAt).toNotExist();
      }).end((err, res) => {
        if(err){
          return done(err);
        }
        done();
      })
  });

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    supertestRequest(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    supertestRequest(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      }).end(done);
  });
})


describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com'
    var password = 'password'
    supertestRequest(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      }).end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var emailInv = 'email@email'
    var passwordInv = 'pass'

    supertestRequest(app)
      .post('/users')
      .send({emailInv, passwordInv})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email
    var password = 'password'
    supertestRequest(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.code).toBe(11000)
      }).end(done);
  })
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    supertestRequest(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      }).end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    var emailInv = "invalidemail@email.com"
    var passwordInv = "invalidpassword"
    supertestRequest(app)
      .post('/users/login')
      .send({emailInv, passwordInv})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done()
        }).catch((e) => done(e));
      });
  })
});
