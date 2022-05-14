const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const moment = require('moment');

module.exports = () => {
    router.post('/registration', (req, res) => {
        const postInfo = req.body;
        const postDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        db.query('INSERT INTO post VALUES(?, ?, ?, ?, ?, ?, ?, ?);', [null, postInfo.userid, postInfo.algCode, postInfo.text, postInfo.tag1, postInfo.tag2, postInfo.tag3, postDate], (error, data) => {
            console.log(postDate);
            if (error) {
                console.log(error);
                res.status(400).end();
            }
        });

        res.status(200).end();
    });

    return router;
}