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
var Event = require('./../models/event')
var eventRegister = require('./../models/event_register');

moment.locale('vi')

router.get('/', (req, res) => {
    var per_page = 10
    var page = req.query.page || 1
    Event.find({})
        .skip(per_page * (page - 1))
        .limit(per_page)
        .lean()
        .exec()
        .then(data => {
            data = data.map(r => {
                return {
                    id: r._id,
                    title: r.title,
                    thumbnail: r.thumbnail,
                    brief: r.brief,
                    startDate: r.startDate,
                    endDate: r.endDate,
                    content: r.content,
                    number: r.number,
                    number_register: r.number_register,
                    rest: r.number - r.number_register,
                    address: r.address,
                    deadline: r.deadline
                }
            })
            return res.json({
                data: data,
                error: null
            })
        })
        .catch(err => {
            return res.status(400).json({
                data: null,
                error: err
            })
        })
})

router.get('/:id', (req, res) => {
    var id = req.params.id
    Event.findOne({ _id: id })
        .then(data => {
            data = {
                id: data._id,
                title: data.title,
                thumbnail: data.thumbnail,
                brief: data.brief,
                startDate: data.startDate,
                endDate: data.endDate,
                content: data.content,
                number: data.number,
                number_register: data.number_register,
                rest: data.number - data.number_register,
                address: data.address,
                deadline: data.deadline
            }
            return res.json({
                data: data,
                error: null
            })
        })
        .catch(err => {
            return res.status(400).json({
                data: null,
                error: err
            })
        })
})

router.post('/register', (req, res) => {
    let id = req.body.id

    Login.findOne({ token: req.headers.token })
        .then(login => {
            if (!login) {
                return res.status(401).json(responseError("Please Login"));
            }

            return login;
        })
        .then(user => {
            Event.findOne({ _id: id })
                .then(event => {
                    if (!event) {
                        return res.status(401).json(responseError("Event not exits"));
                    }

                    return event;
                })
                .then(data => {
                    if (data.number == data.number_register) {
                        return res.status(401).json(responseError("Number enough"));
                    }

                    eventRegister.findOne({ event_id: id, email: user.email })
                        .then(check => {
                            if (check) {
                                return res.status(401).json(responseError("You have register"));
                            }

                            let info = eventRegister({
                                event_id: id,
                                email: user.email,
                                phone: user.phone,
                                name: user.name
                            });
                            data.number_register = data.number_register + 1;
                            sendmail(createMailOpt(info, data));
                            data.save();
                            info.save((err) => {
                                if (err) {
                                    return res.status(500).json(responseError("Server Error"));
                                }

                                return res.json(responseSuccess("Register Event Successful", info))
                            })
                        })
                })
                .catch(err => {
                    return res.status(400).json(responseError("Event not exits"));
                })
        })
})

module.exports = router
