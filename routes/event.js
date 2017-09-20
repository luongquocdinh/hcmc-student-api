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
            for (var i = 0; i < data.length; i++) {
                let d = new Date()
                let year = new Date(data[i].endDate).getFullYear()
                let month = new Date(data[i].endDate).getMonth() + 1
                let date = new Date(data[i].endDate).getDate()
                let hours = d.getHours()
                let minutes = d.getMinutes()
                let seconds = d.getSeconds()
                let from_now = moment([year, month, date, hours, minutes, seconds ], "YYYYMMDD h:mm:ss").fromNow();
                if (from_now == 'vài giây trước') {
                    data[i].status = 'Sự kiện đang diễn ra'
                } else {
                    data[i].status = 'Sự kiện diễn ra ' + from_now 
                }
                data[i].startDate = data[i].startDate.getTime() / 1000
                data[i].endDate = data[i].endDate.getTime() / 1000
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

router.get('/:id', (req, res) => {
    var id = req.params.id
    Event.findOne({_id: id})
        .then(data => {
            let d = new Date()
            let year = new Date(data.endDate).getFullYear()
            let month = new Date(data.endDate).getMonth() + 1
            let date = new Date(data.endDate).getDate()
            let hours = d.getHours()
            let minutes = d.getMinutes()
            let seconds = d.getSeconds()
            let from_now = moment([year, month, date, hours, minutes, seconds ], "YYYYMMDD h:mm:ss").fromNow()
             if (from_now == 'vài giây trước') {
                data.status = 'Sự kiện đang diễn ra'
            } else {
                data.status = 'Sự kiện diễn ra ' + from_now 
            }

            let response = {
                title: data.title,
                thumbnail:  data.thumbnail,
                brief: data.brief,
                startDate: data.startDate.getTime() / 1000,
                endDate: data.endDate.getTime() / 1000,
                content: data.content,
                is_accept: data.is_accept
            }
            
            return res.json({
                data: response,
                status: data.status,
                error: null
            })
        })
        .catch( err => {
            return res.status(400).json({
                data: null,
                error: err
            })
        })
})

router.post('/register', (req, res) => {
    let id = req.body.id

    Login.findOne({token: req.headers.token})
        .then(login => {
            if(!login) {
                return res.json(401).json(responseError("Please Login"));
            }

            return login;
        })
        .then(user => {
            Event.findOne({_id: id})
                .then(event => {
                    if (!event) {
                        return res.status(401).json(responseError("Event not exits"));
                    }
        
                    return event;
                })
                .then(data => {
                    let info = eventRegister({
                        event_id: id,
                        email: user.email,
                        phone: user.phone,
                        name: user.name
                    });
        
                    sendmail(createMailOpt(info, data));
        
                    info.save((err) => {
                        if (err) {
                            return res.status(500).json(responseError("Server Error"));
                        }
        
                        return res.json(responseSuccess("Register Event Successful", info))
                    })
                })
                .catch(err => {
                    return res.status(400).json(responseError("Event not exits"));
                })
        })    
})

module.exports = router
