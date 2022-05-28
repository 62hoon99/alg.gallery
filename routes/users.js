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
        db.query('INSERT INTO users VALUES(?, ?, ?);', [userInfo.userid, hashValue, userInfo.nickname], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else {
                res.status(200).json(res_form.success());
            }
        });
    });

    router.post('/signin', passport.authenticate('local', {
        failureFlash: false,
        successFlash: true
    }), (req, res) => {
        res.status(200).json(res_form.success());
    });

    router.post('/signout', (req, res) => {
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

    router.get('/check', (req, res) => {
        if (req.session.passport === undefined) {
            res.json(400, res_form.fail());
        }
        else {
            res.json(200, res_form.success());
        }
    });

    return router;
}