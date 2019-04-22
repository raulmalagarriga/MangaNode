var express = require('express');
var pg = require("pg");
var app = express();
var port = 4000; 
var connectionString = "postgres://postgres:password@localhost:5432/mangaReaderNode";
 
app.get('/', function (req, res, next) {
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * from GetAllStudent()' ,function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});
 
app.listen(port, function () {
    console.log('Server is running.. on Port 4000');
});