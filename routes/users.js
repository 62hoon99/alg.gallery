const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const hashing = require('../config/hashing');
const salt = require('../db/database').salt();

module.exports = (passport) => {
    router.post('/signin', (req, res) => {
        const userInfo = req.body;
        const hashValue = hashing.enc(userInfo.userid, userInfo.password, salt);
        db.query('INSERT INTO users VALUES(?, ?);', [userInfo.userid, hashValue], (error, data) => {
            if (error) {
                res.status(400).end();
            }
        });

        res.status(200).end();
    });

    router.post('/signup', passport.authenticate('local', {
        successRedirect: '/signup/success', // 로그인 성공시 리디렉션되는 페이지
        failureRedirect: '/signup/failure', // 로그인 실패시 리디렉션되는 페이지
        failureFlash: true,
        successFlash: true
    }));

    router.post('/signout', (req, res) => {
        req.logout();
        req.session.destroy((err) => {
            res.redirect('/signup/success'); // 로그아웃 성공시 리디렉션되는 페이지
        });
    });

    router.get('/id/overlap', (req, res) => {
        const userInfo = req.body;
        db.query('SELECT * FROM users WHERE userid = ?', [userInfo.userid], (error, data) => {
            if (Object.keys(data).length) {
                res.status(400).send();
            } else {
                res.status(200).send();
            }
        });
    });

    return router;
}