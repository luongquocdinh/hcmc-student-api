var express = require('express')
var path = require('path')
var crypto = require('crypto')
var session = require('express-session')
var randomstring = require('randomstring')

let sendmail = require('./../configMail/MailSenderPromise.js')
let createMailOpt = require('./../configMail/mailRedeem.js')

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

var router = express.Router()

let User = require('./../models/user')
let Login = require('./../models/login')
let Redeem = require('./../models/redeem')
let Reward = require('./../models/reward')

router.post('/', (req, res) => {
    let id = req.body.id;
    let token = req.headers.token;
    Login.findOne({ token: token, is_active: true }, (err, login) => {
        if (!login) {
            return res.status(400).json(responseError("Please Login"));
        }

        return login
    })
    .then(login => {
        User.findOne({ is_block: false, is_active: true, _id: login.user_id })
            .then(user => {
                Reward.findOne({ _id: id })
                    .then(reward => {
                        if (reward.point > user.point) {
                            return res.status(401).json(responseError("Not enough point"));
                        }
                        let serial = randomstring.generate({
                            length: 8,
                            charset: 'alphanumeric'
                        });
                        let data = Redeem({
                            user_id: login.user_id,
                            email: login.email,
                            name: login.name,
                            reward_id: id,
                            serial: serial
                        });
                        reward.number_redeem = reward.number_redeem + 1;
                        user.point = user.point - reward.point;
                        data.save();
                        reward.save();
                        user.save();
                        let content = {
                            name: login.name,
                            email: login.email,
                            reward: reward.name,
                            serial: serial
                        }
                        sendmail(createMailOpt(content));
                        return res.json(responseSuccess("System handling", content));
                    })
                    .catch(err => {
                        return res.status(401).json(responseError("Server Error"));
                    })
            })
    })
})



router.get('/log', (req, res) => {
    let token = req.headers.token
    Login.findOne({ token: token, is_active: true }, (err, login) => {
        if (err) {
            return res.status(500).json(responseError("Server error"));
        }

        if (!login) {
            return res.status(400).json(responseError("Please Login"));
        }

        return login
    })
        .then(user => {
            Redeem.find({ user_id: user.user_id })
                .then(log => {
                    return res.json(responseSuccess("Log Redeem", log));
                })
                .catch(err => {
                    return res.status(400).json(responseError("Server Error"));
                })
        })
})

module.exports = router