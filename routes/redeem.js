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

router.post('/', (req, res) => {
    let network = req.body.network
    let value = req.body.value
    let token = req.headers.token
    let email;
    Login.findOne({ token: token, is_active: true },  (err, login) => {
        if (!login) {
            return res.status(400).json(responseError("Please Login"));
        }

        if (parseInt(value) * 5 > parseInt(login.point)) {
            return res.status(400).json(responseError("Point not enough"));
        } else {
            let data = Redeem({
                user_id: login.user_id,
                email: login.email,
                network: network,
                value: value
            });
    
            data.save(function (err) {
                if (err) {
                    return res.status(500).json(responseError("Server Error, please try again"));
                }
            })

            let serial = randomstring.generate({
                length: 11,
                charset: 'numeric'
            });
    
            let code = randomstring.generate({
                length: 13,
                charset: 'numeric'
            });
    
            let content = {
                email: email,
                serial: serial,
                code: code,
                network: network,
                value: value
            }
            sendmail(createMailOpt(content))
             
            return res.json(responseSuccess("System handling", content));
        }
    })
})

router.get('/log', (req, res) => {
    let token = req.headers.token
    Login.findOne({token: token, is_active: true}, (err, login) => {
        if (err) {
            return res.status(500).json(responseError("Server error"));
        }

        if (!login) {
            return res.status(400).json(responseError("Please Login"));
        }

        return login
    })
    .then(user => {
        Redeem.find({user_id: user.user_id})
            .then(log => {
                return res.json(responseSuccess("Log Redeem", log));
            })
            .catch(err => {
                return res.status(400).json(responseError("Server Error"));
            })
    })
})

module.exports = router