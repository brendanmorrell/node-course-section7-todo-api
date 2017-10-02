var {User} = require('./../models/user.js');

var authenticate = (req,res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user) {
      return Promise.reject('Unable to find instance data');
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e);
  });
};


module.exports ={authenticate};
