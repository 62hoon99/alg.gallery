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
        db.query('select postid, post.userid, nickname, algCode, text, tag1, tag2, tag3, post_date from post, (select userid, nickname from users) u_table where post.userid = u_table.userid and postid = ?;', [postid], (error, data) => {
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

    router.get('/sort/mypage/lang', (req, res) => {
        const lang = req.query.lang;
        const userid = req.session.passport.user.userid;

        db.query('select postid, post.userid, nickname, algCode, text, tag1, tag2, tag3, post_date from post, (select userid, nickname from users) u_table where post.userid = u_table.userid and tag1 = ? AND post.userid = ?;', [lang, userid], (error, data) => {
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

    router.get('/sort/mainpage/recent', (req, res) => {
        db.query('select postid, post.userid, nickname, algCode, text, tag1, tag2, tag3, post_date from post, (select userid, nickname from users) u_table where post.userid = u_table.userid order by post_date desc;', (error, data) => {
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

    router.delete('/delete', (req, res) => {
        const postid = req.query.postid;
        db.query('delete from post where postid = ?; delete from likes where postid = ?; delete from comment where postid = ?;', [postid, postid, postid], (error, data) => {
            if (error) {
                res.json(400, res_form.error(error));
            }
            else {
                console.log(data);
                res.json(200, res_form.success());
            }
        });
    });

    return router;
}