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