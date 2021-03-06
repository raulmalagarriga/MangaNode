const db = require('./db');
const bcrypt = require('bcryptjs');

module.exports.getUserByUsername = (username)=>{
    return new Promise((res,rej)=>{
        db.connect().then((obj)=>{
            obj.one("SELECT * FROM users WHERE user_username = $1",[username]).then((data)=>{
                res(data);
                obj.done();
            }).catch((error)=>{
                console.log(error);
                rej(error);
                obj.done();
            });
        }).catch((error)=>{
            console.log(error);
            rej(error);
        });
    });
}

module.exports.comparePassword = (candidatePassword, hash)=>{
    return new Promise((res,rej) => {
        let hashedPass = bcrypt.hashSync(hash, 10);
        bcrypt.compare(candidatePassword, hashedPass, function(err, isMatch) {
            if (err) throw rej(err);
            res(isMatch);
        });
    });
};
