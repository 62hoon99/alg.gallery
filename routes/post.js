const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const moment = require('moment');
const res_form = require('../lib/res_from');

module.exports = () => {
    router.post('/registration', (req, res) => {
        const postInfo = req.body;
        const postDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const userid = req.session.passport.user.userid;
        db.query('INSERT INTO post VALUES(?, ?, ?, ?, ?, ?, ?, ?);', [null, userid, postInfo.algCode, postInfo.text, postInfo.tag1, postInfo.tag2, postInfo.tag3, postDate], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else {
                let form = res_form.success();
                form.data = {
                    "postid": data.insertId
                }
                res.status(200).json(form);
            }
        });
    });

    router.get('/modal', (req, res) => {
        const postid = req.query.postid;
        db.query('select * from post where postid = ?;', [postid], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else if (data[0] === undefined) {
                let form = res_form.fail();
                res.status(404).json(form);
            }
            else {
                let form = res_form.success();
                form.data = data;
                res.status(200).json(form);
            }
        });
    });

    router.get('/sort/lang', (req, res) => {
        const lang = req.query.lang;
        db.query('SELECT * FROM post WHERE tag1 = ?;', [lang], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else {
                let form = res_form.success();
                form.data = data;
                res.status(200).json(form);
            }
        });
    });

    router.get('/sort/recent', (req, res) => {
        db.query('SELECT * FROM post ORDER BY postid DESC', (error, data) => {
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