const express = require('express');
const passport = require('passport');
const auth = require('./../middlewares/isAuth')
let router = express.Router();

router.post('/createUser',(req,res)=>{
  db.connect().then((obj)=>{
    obj.one('INSERT INTO users (user_password, user_username, user_nname, user_creation_time, user_email) VALUES ();')
  })
});

/*
router.get('/value', auth.isAuth, (req, res) => {
    res.send(req.session.passport);
});
*/

/*
router.post('/login', auth.isLogged, function (req, res, next) {
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
    })(req, res, next);
});
*/

/*
router.get('/logout', auth.isAuth, function (req, res) {
    req.logout();
    res.status(200).send({
        status: 'Bye!'
    });
});
*/

module.exports = router;
