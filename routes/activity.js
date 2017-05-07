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

// API add topic
// router.post('/topic', function (req, res) {
//     var data = Activity({
//         topic: req.body.topic,
//         is_enable: true,
//         news: []
//     })

//     Activity.findOne({topic: req.body.topic}, function (err, topic) {
//         if (err) throw err
//         if (!topic) {
//             data.save(function (err) {
//                 if (err) throw err
//                 return res.json(responseSuccess("Add topic successful", data))
//             })
//         } else {
//             return res.json(responseError("Topic exist"))
//         }
//     })
// })

// API add news
// router.post('/add', function (req, res) {
//     var form = new formidable.IncomingForm()

//     form.multiples = true
//     form.keepExtensions = true
//     form.uploadDir = path.join(__dirname, './../uploads/news')

//     form.parse(req, function (err, fields, files) {
//         if (err) {
//             console.log('Error is: ' + err)
//         }
//         var imageDir = files.thumbnail.path
//         var data = {
//             "title": fields.title,
//             "thumbnail": imageDir.substring(imageDir.indexOf('/uploads/news/')),
//             "brief": fields.brief,
//             "content": fields.content,
//         }
//         News.findOne({_id: req.headers._id}, function (err, news) {
//             if (err) console.log(err)
//             if (news) {
//                 news.news.push(data)
//                 news.save()
//                 news.news.sort({updated_at: 1})
//                 return res.json(responseSuccess("Add news successful", news))
//             } else {
//                 return res.json(responseError("Add news error"))
//             }
//         })
//     })
// })

// API edit topic
// router.put('/edit-topic/:id', function (req, res) {
//     console.log(req.params.id)
//     News.findOne({_id: req.params.id}, function (err, news) {
//         if (err) return console.log(err)
//         if (news) {
//             news.topic = req.body.topic
//             news.is_enable = req.body.is_enable
//             news.updated_at = new Date()
//             news.save()
//             return res.json(responseSuccess("Update topic successful", news))
//         } else {
//             return res.json(responseError("Topic not exist"))
//         }
//     })
// })

// API edit news
// router.put('/edit-news/:id/:id_news', function (req, res) {
//     News.findOne({_id: req.params.id}, function (err, news) {
//         if (err) return console.log(err)
//         if (news) {
//             for (var i = 0; i < news.news.length; i++) {
//                 if (news.news[i].id === req.params.id_news) {
//                     var form = new formidable.IncomingForm()
//                     var index = i

//                     form.multiples = true
//                     form.keepExtensions = true
//                     form.uploadDir = path.join(__dirname, './../uploads/news')

//                     form.parse(req, function (err, fields, files) {
//                         if (err) {
//                             console.log("Err", err)
//                         }
//                         news.news[index].title = fields.title
//                         news.news[index].brief = fields.brief
//                         news.news[index].content = fields.content
//                         news.news[index].updated_at = new Date()
//                         imageDir = path.join(__dirname, './../' + news.news[index].thumbnail)
//                         if (files.thumbnail) {
//                             image = files.thumbnail.path
//                             fs.unlinkSync(imageDir)
//                             news.news[index].thumbnail = image.substring(image.indexOf('/uploads/news/'))
//                         }

//                         news.save()
//                         return res.json(responseSuccess("Update News successful", news))
//                     })
//                 }
//             }
//         }
//     })
// })

module.exports = router