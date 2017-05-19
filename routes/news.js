var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var util = require('util');

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var User = require('./../models/user')
var Login = require('./../models/login')
var News = require('./../models/news')
var View = require('./../models/view')
var Comment = require('./../models/comment')

var sess;

// API get list News
router.get('/', function (req, res) {
    sess = req.session
    News.find({})
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
            return res.json(responseSuccess("Tin tức", data))
        })
})

// API get list news by topic
router.get('/:topic_ascii', function (req, res) {
    News.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
        if (err) return console.log(err)
        news.news.sort(function (a, b) {
            return new Date(b.updated_at) - new Date(a.updated_at)
        })
        var result = news.news.slice(0, 11)
        return res.json(responseSuccess(news.topic, result))
    })
})

// API get news
router.get('/:topic_ascii/:id', function (req, res) {
    var result
    var sess = req.session
    if (typeof sess.email != 'undefined') {
        News.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
            if (err) return console.log(err)
            if (news) {
                for (var i = 0; i < news.news.length; i++) {
                    if (news.news[i].id === req.params.id) {
                        result = news.news[i]
                        View.findOne({
                            $and: [
                                {news_id: req.params.id, user_id: sess.user_id}
                            ]
                        })
                        .then(r => {
                            if (!r) {
                                var data_view = View({
                                    news_id: req.params.id,
                                    user_id: sess.user_id
                                })

                                data_view.save(function (err, data) {
                                    if (err) {
                                        return console.log(err)
                                    }
                                    User.findOne({_id: sess.user_id}, function (err, user) {
                                        if (err) {
                                            return console.log(err)
                                        }
                                        user.point++
                                        user.save()
                                        return res.end(result); 
                                    })
                                })
                            }
                            return res.json({
                                data: result,
                                error: null
                            })
                        })
                    }
                }
            }
        })
    } else {
        News.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
            if (err) {
                return console.log(err)
            }
            if (news) {
                for (var i = 0; i < news.news.length; i++) {
                    if (news.news[i].id === req.params.id) {
                        return res.json({
                            data: news.news[i],
                            error: null
                        })
                    }
                }
            }
        })
    }

})

// API get comment
router.get('/:topic_ascii/:id/comment', function (req, res) {
    Comment.find({news_id: req.params.id})
        .sort({"created_at": -1})
        .then(r => {
            return res.json({
                data: r,
                error: null
            })
        })
        .catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

// API post comment
router.post('/:topic_ascii/:id/comment', function (req, res) {
    var sess = req.session
    var content = req.body.content
    News.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
        if (err) return console.log(err)
        if (news) {
            for (var i = 0; i < news.news.length; i++) {
                if (news.news[i].id === req.params.id) {
                    var comment = Comment({
                        content: content,
                        username: sess.name,
                        user_id: sess.user_id,
                        topic_id: req.params.id,
                        news_id: req.params.id
                    })

                    comment.save(function (err) {
                        if (err) {
                            return console.log(err)
                        }
                        return res.json({
                            data: comment,
                            error: null
                        })
                    })
                }
            }
        }
    })
})
module.exports = router