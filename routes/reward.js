var express = require('express')
var path = require('path')
var router = express.Router()
var moment = require('moment')

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

let sendmail = require('./../configMail/MailSenderPromise')
let createMailOpt = require('./../configMail/mailEvent')

var User = require('./../models/user')
var Login = require('./../models/login')
var Reward = require('./../models/reward')
var eventRegister = require('./../models/event_register');

router.get('/', (req, res) => {
    Reward.find({ is_enable: true })
        .then(data => {
            data = data.map(p => {
                return {
                    id: p._id,
                    name: p.name,
                    thumbnail: p.thumbnail,
                    detail: p.detail,
                    number: p.number,
                    number_redeem: p.number_redeem,
                    rest: p.number - p.number_redeem,
                    deadline: p.deadline,
                    is_enable: p.is_enable,
                }
            })
            return res.json(responseSuccess("List Reward", data))
        })
        .catch(err => {
            return res.status(401).json(responseError("Request error"));
        })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Reward.findOne({is_enable: true, _id: id})
        .then(data => {
            data = {
                id: data._id,
                name: data.name,
                thumbnail: data.thumbnail,
                detail: data.detail,
                number: data.number,
                number_redeem: data.number_redeem,
                rest: data.number - data.number_redeem,
                deadline: data.deadline,
                is_enable: data.is_enable,
            }

            return res.json(responseSuccess("Reward", data));
        })
        .catch(err => {
            return res.status(401).json(responseError("Request error"));
        })
})

module.exports = router