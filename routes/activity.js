var express = require('express')
var path = require('path')
var formidable = require('formidable')
var fs = require('fs')
var util = require('util');

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var User = require('./../models/user')
var Login = require('./../models/login')
var Activity = require('./../models/activity')

// API get list News
router.get('/', function (req, res) {
    Activity.find({})
        .sort({_id: -1})
        .then(data => {
            for(var i = 0; i < data.length; i++) {
                data[i].news.sort(function (a, b) {
                    return new Date(b.updated_at) - new Date(a.updated_at)
                })
            }
            return data
        })
        .then(news => {
            var data = []
            for (var i = 0; i < news.length; i++) {
                var element = {
                    "topic": news[i].topic,
                    "news": news[i].news.slice(0, 4)
                }
                data.push(element)
            }
            return res.json(responseSuccess("Hoạt động", data))
        })
})

// API get list news by topic
router.get('/:id', function (req, res) {
    Activity.findOne({_id: req.params.id}, function (err, news) {
        if (err) return console.log(err)
        news.news.sort(function (a, b) {
            return new Date(b.updated_at) - new Date(a.updated_at)
        })
        var result = news.news.slice(0, 11)
        return res.json(responseSuccess(news.topic, result))
    })
})

module.exports = router