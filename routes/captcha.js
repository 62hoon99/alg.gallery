const express = require('express');
const router = express.Router();
const client_id = 'm9K36xwFM3iNfe7ekwgE';//개발자센터에서 발급받은 Client ID
const client_secret = 'cdBAaMoYz6'; //개발자센터에서 발급받은 Client Secret
const code_nkey = "0";
const code_result = "1";
const fs = require('fs');

module.exports = () => {
    router.get('/nkey', (req, res) => {
        const api_url = 'https://openapi.naver.com/v1/captcha/nkey?code=' + code_nkey;
        const request = require('request');
        const options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
                res.end(body);
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        });
    });

    router.get('/image', (req, res) => {
        const api_url = 'https://openapi.naver.com/v1/captcha/ncaptcha.bin?key=' + req.body.key;
        const request = require('request');
        const options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };
        const writeStream = fs.createWriteStream('./captcha.jpg');
        const _req = request.get(options).on('response', function (response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type'])
        });
        _req.pipe(res); // 브라우저로 출력
    });

    router.get('/result', (req, res) => {
        const api_url = 'https://openapi.naver.com/v1/captcha/nkey?code=' + code_result + '&key=' + req.body.key + '&value=' + req.body.value;
        const request = require('request');
        const options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
                res.end(body);
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        });
    });

    return router;
}