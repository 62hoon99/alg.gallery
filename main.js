const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const secretSessionKey = require('./db/database').secretSessionKey();
const flash = require('connect-flash');
const cors = require('cors');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(session({
    secret: secretSessionKey,
    resave: false,
    saveUninitialized: false,
    store: new FileStore()
}));
app.use(flash());
app.use(cors());

const passport = require('./config/passport')(app);
const usersRouter = require('./routes/users')(passport);
const captchaRouter = require('./routes/captcha')();
const postRouter = require('./routes/post')();

app.use('/users', usersRouter);
app.use('/captcha', captchaRouter);
app.use('/post', postRouter);

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(8080, () => {
    console.log('Example app listening on port 3000!');
});