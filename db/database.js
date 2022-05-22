const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const db = {
    "development": {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        dateStrings: 'date'
    }
}

const dbcon = {
    init: () => {
        return mysql.createConnection(db.development);
    },
    salt: () => {
        return process.env.salt;
    },
    secretSessionKey: () => {
        return process.env.secretSessionKey;
    }
}

module.exports = dbcon;