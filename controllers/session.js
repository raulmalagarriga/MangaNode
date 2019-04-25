const express = require('express');
const passport = require('passport');
const auth = require('./../middlewares/isAuth');
var db = require('../helpers/db');
let route = express.Router();
const bcrypt = require('bcryptjs');

route.post('/createUser',(req,res)=>{
  var newUser = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10), //bcrypt.hashSync('myPassword', null);
    name: req.body.name,
    email: req.body.email
  };
  db.connect().then((obj)=>{
    obj.one("INSERT INTO users (user_password, user_username, user_name, user_email) VALUES ('"+newUser.password+"','"+newUser.username+"','"+newUser.name+"','"+newUser.email+"')")
    .then((data)=>{
        console.log(data);
        res.send({data:data, status: 200});
        obj.done();
  }).catch((error)=>{
    console.log(error);
    res.send({
      error:error,
      msg:'No se ha creado el usuario',
      status:500
    });
    obj.done();});
  }).catch((error)=>{
    console.log(error);
    res.send({
      error:error,
      msg:'No se ha creado el usuario',
      status:500
    });
  });
});


route.post('/login', auth.isLogged, function (req, res, next) {
  passport.authenticate('local', function(err, user, info){
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err){
      if (err) {
        return res.status(500).json({
          err: 'No ha sido posible iniciar sesion'
        });
      }
      res.status(200).json({
        status: 'Sesion iniciaida'
      });
    });
  })(req, res, next);
    console.log(req.session);
  });
/*
  var logUser = {
    username: req.body.username,
    password: req.body.password
  };
  db.connect().then((obj)=>{
    obj.one("SELECT * FROM users WHERE user_username='"+logUser.username+"' AND user_password='"+logUser.password+"'")
    .then((data)=>{
      console.log(data);
      res.send({data:data,status:200});
      obj.done();
    }).catch((error)=>{
      console.log(error);
      res.send({error:error,msg:'Usuario no conseguido',status:404});
      obj.done();
    });
  }).catch((error)=>{
    console.log(error);
    res.send({error:error,msg:'Algo salio mal',status:500});
  });
  console.log("Logeado "+logUser);
  passport.authenticate('local',function(req, username, password, done){

  });

  */
  /*
   passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).send({
                    err: 'Could not log in user'
                });
            }
            res.status(200).send({
                status: 'Login successful!'
            });
        });
    })(req, res, next);*/
//    console.log(req.session);
//});

route.get('/logout', auth.isAuth, function (req, res) {
    req.logout();
    res.status(200).send({
        status: 'Bye!'
    });
});

module.exports = route;
