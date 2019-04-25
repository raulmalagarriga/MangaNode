const express = require('express');
const passport = require('passport');
const auth = require('./../middlewares/isAuth');
var db = require('../helpers/db');
let route = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');

route.post('/createUser',(req,res)=>{
  var newUser = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    email: req.body.email
  };
  db.connect().then((obj)=>{
    obj.one('INSERT INTO users (user_password, user_username, user_name, user_email) VALUES ($1,$2,$3,$4) RETURNING user_id, user_username, user_name, user_email',
    [bcrypt.hashSync(req.body.password, 10),
      req.body.username,
      req.body.name,
      req.body.email
    ])
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
    console.log("HOLA");
    console.log(req.session.user);

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({
        err: info
      });
    }
    req.logIn(user, function(err){
      if (err) {
        return res.status(500).send({
          err: 'No ha sido posible iniciar sesion'
        });
      }
      res.status(200).send({
        status: 'Sesion iniciaida'
      });
    });
  })(req, res, next);
  console.log("Session ID: "+req.session.id);
  console.log(req.session);
});

route.get('/logout', function (req, res) {
    req.logout();
    console.log("Hasta la vista BEIBI");
    res.status(200).send({
        status: 'Adios..!'
    });
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/storage');
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`)
       }
    });
let upload = multer({storage:storage});

/*
router.get('/getFile/:filename',(req,res)=>{
    res.download(`${__dirname}/../public/uploads/${req.params.filename}`);
});

router.post('/uploadMultFile',upload.array('files[]'),(req,res)=>{
    res.send({status:200});
});
*/

module.exports = route;
