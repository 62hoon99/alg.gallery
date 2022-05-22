const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const moment = require('moment');
const res_form = require('../lib/res_from');

module.exports = () => {

    router.post('/registration', (req, res) => {
        const commentInfo = req.body;
        const commentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const userid = req.session.passport.user.userid;
        db.query('INSERT INTO comment VALUES(?, ?, ?, ?);', [commentInfo.postid, userid, commentInfo.text, commentDate], (error, data) => {
            if (error) {
                res.json(400, res_form.error(error));
            }
            else {
                res.json(200, res_form.success());
            }
        });
    });

    router.get('/order', (req, res) => {
        const postid = req.query.postid;
        db.query('SELECT * FROM comment WHERE postid = ? ORDER BY comment_date', [postid], (error, data) => {
            if (error) {
                res.json(400, res_form.error(error));
            }
            else {
                let form = res_form.success();
                form.data = data;
                res.json(200, form);
            }
        });
    });

    return router;
}