var express = require('express');
var router = express.Router();
const db = require('../db/database').init();
const hashing = require('../config/hashing');
const salt = require('../db/database').salt();

router.post('/creation/account', (req, res) => {
    const userInfo = req.body;
    const hashValue = hashing.enc(userInfo.userid, userInfo.password, salt);
    db.query('INSERT INTO users VALUES(?, ?);', [userInfo.userid, hashValue], (error, data) => {
        if (error) {
            res.status(400).end();
        }
    });

    res.status(200).end();
});

module.exports = router;