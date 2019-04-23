var LocalStrategy   = require('passport-local').Strategy;

// load up the user model

var bcrypt = require('bcrypt-nodejs');
// load up the user model
const pg = require('pg');
//var bcrypt = require('bcrypt-nodejs');

var config = {
  user: 'postgres', 
  database: 'mangareadernode3', 
  password: 'password', 
  host: 'localhost', 
  port: 5432, 
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    passport.use(
      'local-signup',
      new LocalStrategy({
          usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
          pool.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, rows) {
              if (err)
                  return done(err);
              if (rows.rows.length) {
                  return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
              } else {
                  // if there is no user with that username
                  // create the user
                  var newUserMysql = {
                      username: username,
                      password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                  };

                  //var insertQuery = ;

                  pool.query("INSERT INTO users ( username, password ) values ('"+ newUserMysql.username+"','"+newUserMysql.password+"')",function(err, rows) {
                    //console.log();
                      newUserMysql.id = rows.result;
                      //done(err);
                      return done(null, newUserMysql);
                  });

              }
          });
      })
  );

    