const express = require('express');
const passport = require('passport');
const auth = require('./../middlewares/isAuth');
var db = require('../helpers/db');
let route = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
//var userId;

route.post('/createUser',(req,res)=>{
  /*var newUser = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    email: req.body.email
  };*/
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


route.post('/comments',function(req, res){
  /*
  db.connect().then((obj)=>{
    
    obj.one('SELECT user_id FROM users WHERE user_username=$1',[req.body.id])
    .then((data)=>{
      console.log(data);
      res.send({data:data, status: 200});
      userId = data.user_id;
      obj.done();
    }).catch((error)=>{
      console.log(error);
      res.send({
        error:error,
        msg:'no se tomo el id',
        status:500
      });*/
    db.connect().then((obj)=>{

      obj.one('INSERT INTO comments_manga (user_id, manga_id, comment_content) VALUES ($1,$2,$3) RETURNING comment_id, user_id, manga_id, comment_content',
      [req.body.uId,
      req.body.mangaId,
      req.body.commentContent])
      .then((data)=>{
        console.log(data);
        res.send({data:data, status: 200});
        obj.done();
      }).catch((error)=>{
        console.log(error);
        res.send({
          error:error,
          msg:'no se inserto el comentario',
          status:500
        });
    });
  });
});
//});
//});

route.post('/like', function(req, res){
    db.connect().then((obj)=>{
      obj.one('INSERT INTO likes_manga (user_id, manga_id) VALUES ($1,$2) RETURNING user_id, manga_id',
      [req.body.uId,
      req.body.mangaId])
      .then((data)=>{
        console.log(data);
        res.send({data:data, status: 200});
        obj.done();
      }).catch((error)=>{
        console.log(error);
        res.send({
          error:error, msg : 'no like insertado', status: 500
        });
      });
    });
});


const fs = require('fs');
var dir = "./public/storage/";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let fdir = __dirname+"./../public/storage/"+req.body.username+"/"+req.body.mangaName+"/"+req.body.mangaChapter+"/"
      console.log("Dir: " + fdir);
      if (!fs.existsSync(fdir)) {
        fs.mkdirSync(fdir,  { recursive: true }, (err) => {
          if (err) throw err;
        });
        console.log("Directory Created.");
      } else {
        console.log("Directory Exists.");
      }
      cb(null, "./public/storage/"+req.body.username+"/"+req.body.mangaName+"/"+req.body.mangaChapter);
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`)
       }
    });
let upload = multer({storage:storage});

/*
route.get('/getFile/:filename',(req,res)=>{
    res.download(`${__dirname}/../public/storage/${req.params.username}/${req.params.mangaName}/${req.params.mangaChapter}/${req.params.filename}`);
});
*/

route.post('/uploadMultFile',upload.array('files[]'),(req,res)=>{
  console.log("Multiple Files");
    res.send({status:200,message:"Archivos subidos"});
});


module.exports = route;
