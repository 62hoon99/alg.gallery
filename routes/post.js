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
        db.query('SELECT * FROM post WHERE postid = ?;', [postid], (error, data) => {
            if (error) {
                res.status(400).json(res_form.error(error));
            }
            else if (data[0] === undefined) {
                let form = res_form.fail();
                res.status(404).json(form);
            }
            else {
                let form = res_form.success();
                form.data = data[0];
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
                // res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
                res.status(200).json(form);
            }
        });
    });

    router.post('/likes/click', (req, res) => {
        if (req.session === undefined || req.session.passport === undefined) { // 비인증 상태인 유저가 좋아요를 누른 경우
            let form = res_form.fail();
            form.errors = "비인증 상태 - 로그인 필요"
            res.status(401).json(form);
        }
        else {
            const postid = req.body.postid;
            const userid = req.session.passport.user.userid;
            db.query('SELECT * FROM likes WHERE postid = ? and userid = ?;', [postid, userid], (error, data) => {
                if (error) {
                    res.status(400).json(res_form.error(error));
                }
                else if (data[0] === undefined) { // 사용자가 해당 post에 좋아요 누른적이 없는 경우
                    likes_insert(postid, userid);
                    likes_count(postid, 1);
                }
                else { // 사용자가 해당 post에 좋아요 누른적이 있는 경우
                    likes_delete(postid, userid);
                    likes_count(postid, 0);
                }
            });
        }

        const likes_insert = (postid, userid) => {
            db.query('INSERT INTO likes values(?, ?);', [postid, userid], (error, data) => {
                if (error) {
                    res.status(400).json(res_form.error(error));
                }
            });
        };

        const likes_delete = (postid, userid) => {
            db.query('DELETE FROM likes WHERE postid = ? and userid = ?', [postid, userid], (error, data) => {
                if (error) {
                    res.status(400).json(res_form.error(error));
                }
            });
        };

        const likes_count = (postid, status) => {
            db.query('SELECT COUNT(*) AS count FROM likes WHERE postid = ?', [postid], (error, data) => {
                if (error) {
                    res.status(400).json(res_form.error(error));
                }
                else {
                    let form = res_form.success();
                    form.data = data[0];
                    form.data.status = status; // 좋아요면 1 아니면 0
                    res.status(200).json(form);
                }
            });
        };
    });

    return router;
}