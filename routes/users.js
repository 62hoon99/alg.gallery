const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const hashing = require('../config/hashing');
const salt = require('../db/database').salt();
const res_form = require('../lib/res_from');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

module.exports = (passport) => {
    router.post('/signup', isNotLoggedIn, (req, res) => {
        const userInfo = req.body;
        const hashValue = hashing.enc(userInfo.userid, userInfo.password, salt);
        db.query('INSERT INTO users VALUES(?, ?, ?);', [userInfo.userid, hashValue, userInfo.nickname], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else {
                res.status(200).json(res_form.success());
            }
        });
    });

    router.post('/signin', isNotLoggedIn, (req, res, next) => {
        passport.authenticate('local', (authError, user, info) => {
            if (authError) {
                return next(authError);
            }
            if (!user) {
                return res.json(401, res_form.fail());
            }
            return req.logIn(user, (loginError) => {
                if (loginError) {
                    return next(loginError);
                }
                return res.json(200, res_form.success());
            });
        })(req, res, next);
    });

    router.post('/signout', isLoggedIn, isLoggedIn, (req, res) => {
        req.logout();
        req.session.destroy();
        res.json(200, res_form.success());
    });

    router.get('/overlap', (req, res) => {
        const userid = req.query.userid;
        db.query('SELECT * FROM users WHERE userid = ?', [userid], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else if (data[0] === undefined) {
                res.status(200).json(res_form.success());
            } else {
                res.status(400).json(res_form.fail());
            }
        });
    });

    router.get('/check', isLoggedIn, (req, res) => {
        if (req.session.passport === undefined) {
            res.json(400, res_form.fail());
        }
        else {
            res.json(200, res_form.success());
        }
    });

    return router;
}