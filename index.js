const express = require('express');
let session = require('express-session');
const app = express();
const config = require('./helpers/config');
let passport = require('passport');
var bodyParser = require('body-parser');

//app.use('/views', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'keyboardcat',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use(passport.initialize());
app.use(passport.session());
app.use('/',require('./controllers'));

//app.get('/', function (req, res) {
//    res.redirect('views/index.html');
//});

passport.use(require('./helpers/localStrategy'));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.listen(config.port, function () {
  console.log("Dirname: " + __dirname);
  console.log('Listening Port: 8000');
});
