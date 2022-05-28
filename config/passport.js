const hashing = require('./hashing');
const db = require('../db/database').init();
const salt = require('../db/database').salt();

module.exports = (app) => {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'userid',
        passwordField: 'password',
        session: true,
    }, (userid, password, done) => {
        const hashValue = hashing.enc(userid, password, salt);
        db.query('SELECT * FROM users WHERE userid = ?;', [userid], (error, user) => {
            if (error) {
                return done(error);
            }

            user = user[0];

            if (user == null || user == undefined) {
                return done(null, false, { message: '존재하지 않는 아이디입니다' });
            }
            else if (hashValue === user.password) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: '비밀번호가 틀렸습니다' });
            }
        });
    }));

    return passport;
}