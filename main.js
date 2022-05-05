const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const helmet = require('helmet');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use('/alg.gallery.com/users', usersRouter);

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});