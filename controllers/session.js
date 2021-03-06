const express = require('express');
const passport = require('passport');
const auth = require('./../middlewares/isAuth');
var db = require('../helpers/db');
let route = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');

route.post('/createUser',(req,res)=>{

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

route.post('/subscribe', function(req, res){
  db.connect().then((obj)=>{

    obj.one('INSERT INTO subscribe (user_id, manga_id) VALUES ($1,$2) RETURNING user_id, manga_id' ,[req.body.uId,req.body.mangaId])
    .then((data)=>{
      console.log(data);
      res.send({data:data, status:200});
      obj.done();
    }).catch((error)=>{
      console.log(error);
      res.send({
        error:error, msg : 'no subsc' , status: 500
      });
    })
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

route.post('/createChapter',upload.array('files[]'),(req,res)=>{
  let usrName = req.body.username;
  let mName = req.body.mangaName;
  let mChap = req.body.mangaChapter;
  let chapTitle = req.body.chapterTitle;
  let chapPag = req.body.chapterPages;
  let chapLocation = __dirname+"./../public/storage/"+usrName+"/"+mName+"/"+mChap+"/";
  db.connect().then((obj)=>{
    obj.one('SELECT manga_id FROM manga WHERE manga_name=$1',[req.body.mangaName])
    .then((data)=>{
      let mId = data.manga_id;
      console.log(data);
      obj.one('INSERT INTO chapters (manga_id, chapter_number, chapter_title, chapter_location, chapter_num_pages) VALUES ($1,$2,$3,$4,$5) RETURNING manga_id, chapter_title, chapter_number',
      [parseInt(mId),parseInt(mChap),chapTitle,chapLocation,chapPag])
      .then((data)=>{
        console.log(data);
        res.send({data:data,status:200});
      }).catch((error)=>{
        console.log(error);
        res.send({error:error,msg:'No se creo el capitulo',status:500});
      });
      //res.send({data:data, status: 200});
      //obj.done();
    }).catch((error)=>{
      console.log(error);
      res.send({error:error,msg:'Usuario Invalido',status:500});
    });
  });
  res.send({status:200,message:"Archivos subidos"});
});

route.post('/createManga',function (req,res){
  let usName = req.body.username;
  let mName = req.body.mangaName;
  let mSynop = req.body.mangaSynopsis;
  let gMang = req.body.genreManga;
  db.connect().then((obj)=>{
    obj.one('SELECT user_id FROM users WHERE user_username=$1',[req.body.username])
    .then((data)=>{
      let usrId = data.user_id;
      let mDir = __dirname+"./../public/storage/"+usName+"/"+mName;
      if (!fs.existsSync(mDir)) {
        fs.mkdirSync(mDir, { recursive: true });
      };
      console.log("ID: "+usrId);
      obj.one('INSERT INTO manga (user_id, manga_name, manga_synopsis, genres_id) VALUES ($1,$2,$3,$4) RETURNING manga_name, manga_synopsis',
      [parseInt(usrId),mName,mSynop,gMang])
      .then((data)=>{
        console.log(data);
        res.send({data:data,status:200});
        //obj.done();
      }).catch((error)=>{
        console.log(error);
        res.send({error:error,msg:'No se creo el manga',status:500});
      });
      //res.send({data:data, status: 200});
      //obj.done();
    }).catch((error)=>{
      console.log(error);
      res.send({error:error,msg:'Usuario Invalido',status:500});
    });
  });
});

module.exports = route;
