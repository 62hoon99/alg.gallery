const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const hashing = require('../config/hashing');
const salt = require('../db/database').salt();
const res_form = require('../lib/res_from');

module.exports = (passport) => {
    router.post('/signup', (req, res) => {
        const userInfo = req.body;
        const hashValue = hashing.enc(userInfo.userid, userInfo.password, salt);
        db.query('INSERT INTO users VALUES(?, ?);', [userInfo.userid, hashValue], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else {
                res.status(200).json(res_form.success());
            }
        });
    });

    router.post('/signin', passport.authenticate('local', {
        successRedirect: '/users/signin/success', // 로그인 성공시 리디렉션되는 페이지
        failureRedirect: '/users/signin/failure', // 로그인 실패시 리디렉션되는 페이지
        failureFlash: true,
        successFlash: true
    }));

    router.post('/signout', (req, res) => {
        req.logout();
        req.session.destroy((err) => {
            res.redirect('/users/signout/success'); // 로그아웃 성공시 리디렉션되는 페이지
        });
    });

    router.get('/overlap', (req, res) => {
        const userInfo = req.body;
        db.query('SELECT * FROM users WHERE userid = ?', [userInfo.userid], (error, data) => {
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

    router.get('/signin/success', (req, res) => { // 로그인 성공시 리디렉션되는 페이지
        res.status(200).json(res_form.success());
    });

    router.get('/signin/failure', (req, res) => { // 로그인 실패시 리디렉션되는 페이지
        res.status(400).json(res_form.fail());
    });

    router.get('/signout/success', (req, res) => { // 로그아웃 성공시 리디렉션되는 페이지
        res.status(200).json(res_form.success());
    });

    return router;
}