const express = require('express');
const router = express.Router();
const db = require('../db/database').init();
const moment = require('moment');
const res_form = require('../lib/res_from');

module.exports = () => {
    router.post('/registration', (req, res) => {
        const postInfo = req.body;
        const postDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        db.query('INSERT INTO post VALUES(?, ?, ?, ?, ?, ?, ?, ?);', [null, postInfo.userid, postInfo.algCode, postInfo.text, postInfo.tag1, postInfo.tag2, postInfo.tag3, postDate], (error, data) => {
            if (error) {
                let form = res_form.fail();
                form.errors = error;
                res.status(400).json(form);
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
        const postid = req.body.postid;
        db.query('SELECT * FROM post WHERE postid = ?', [postid], (error, data) => {
            if (error) {
                let form = res_form.fail();
                form.errors = error;
                res.status(400).json(form);
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
        const lang = req.body.lang;
        db.query('SELECT * FROM post WHERE tag1 = ?', [lang], (error, data) => {
            if (error) {
                let form = res_form.fail();
                form.errors = error;
                res.status(400).json(form);
            }
            else {
                let form = res_form.success();
                form.data = data;
                res.status(200).json(form);
            }
        });
    });

    return router;
}