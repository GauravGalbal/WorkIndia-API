var dotenv = require('dotenv')
dotenv.config();
var express = require('express');
const router = express.Router();
var cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

const auth = require('./authRoute')
var { db } = require('../Database/Connection');


const generateaccount = (req) => {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(5, '0');

    return `${hours}${minutes}${seconds}${randomDigits}`;
}


router.post('/signup', async (req, res) => {
    try {
        const user_id = generateaccount(req);
        const table = process.env.SQL_USER_TABLE;

        const userData = {
            email: req.body.email,
            username: req.body.username,
            password: cryptoJs.AES.encrypt(req.body.password, process.env.CRYPTO_KEY).toString(),
            user_id: user_id
        }

        var query = `INSERT INTO ${table} SET ?`;
        // var state = `INSERT INTO ${process.env.SQL_ACCOUNT_TABLE} SET ?`;

        // db.query(state, userAccountData, (error, result) => {
        //     if (error) throw error;
        // })

        db.query(query, userData, async (error, results) => {
            if (error) throw error;

            res.status(200).json({
                'user_id': user_id,
                'status': "Account successfully created",
            })
        });

    } catch (err) {
        console.log(err);
        res.status(401).send('Error while saving data');
    }
})


router.post('/login', async (req, res) => {
    try {
        const table = process.env.SQL_USER_TABLE

        var query = `SELECT * from ${table} WHERE (username='${req.body.username}')`;

        db.query(query, async (error, user) => {
            if (error) throw error;
            else if (user.length === 0) {
                console.log('No data found');
                res.status(401).json({
                    'status': 'Incorrect username/password provided. Please retry'
                });
            }
            else {
                const temp = cryptoJs.AES.decrypt(user[0].password, process.env.CRYPTO_KEY);
                const password = temp.toString(cryptoJs.enc.Utf8);

                if (password === req.body.password) {
                    const token = jwt.sign({ username: user[0].username }, process.env.JWT_KEY, {
                        expiresIn: "2 minutes"
                    })

                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 600000),
                        httpOnly: true
                    })

                    res.status(200).json({
                        'user_id': user[0].user_id
                    })
                }
                else
                    res.status(401).send('Incorrect username/password provided. Please retry');
            }
        })
    } catch (err) {
        console.log(err);
        res.status(401).send('Incorrect username/password provided. Please retry');
    }
})





module.exports = router