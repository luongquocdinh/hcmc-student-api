var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment')

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Location = require('./../models/location')
var View = require('./../models/view')
var Comment = require('./../models/comment')

var sess;

var per_page = 10;

// API get list News
router.get('/', function (req, res) {
    sess = req.session
    Location.find({})
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
            var response = []
            var index = 0
            for (var i = 0; i < data.length; i++) {
                if (typeof data[i].news[0] !== 'undefined') {
                    View.count({news_id: data[i].news[0]._id}, function (err, view) {
                        if (view) {
                            response.push({
                                data: data[index],
                                views: view
                            })
                        } else {
                            response.push({
                                data: data[index],
                                views: view
                            })
                        }
                        if (index + 1 == i) {
                            return res.json(responseSuccess("Địa điểm", response))
                        }
                        index++
                    })
                } else {
                    index++
                }
            }
        })
})

// API get list news by topic
router.get('/:topic_ascii', function (req, res) {
    let page = req.query.page || 1
    Location.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
        if (err) return console.log(err)
        news.news.sort(function (a, b) {
            return new Date(b.updated_at) - new Date(a.updated_at)
        })
        var result = news.news.slice((page - 1)*per_page, per_page*page)
        var response = []
        var index = 0
        if (result.length > 0) {
            result.forEach(function (item) {
                View.count({news_id: item._id}, function (err, view) {
                    response.push({
                        data: item,
                        date: moment(result[index].created_at).valueOf(),
                        views: view
                    })
                    index++
                    if (index == result.length) {
                        return res.json(responseSuccess(news.topic, response))
                    }
                })
            })
        } else {
            return res.json(responseSuccess(news.topic, result))
        }
    })
})

// API get news
router.get('/:topic_ascii/:id', function (req, res) {
    var result
    Login.findOne({ token: req.headers.token }, function (err, login) {
        if (login) {
            Location.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
                if (err) return console.log(err)
                if (news) {
                    for (var i = 0; i < news.news.length; i++) {
                        if (news.news[i].id === req.params.id) {
                            result = news.news[i]
                            View.findOne({
                                $and: [
                                    {news_id: req.params.id, user_id: login.user_id}
                                ]
                            })
                            .then(r => {
                                if (!r) {
                                    var data_view = View({
                                        news_id: req.params.id,
                                        user_id: login.user_id,
                                        type: "location",
                                        topic_ascii: req.params.topic_ascii,
                                        title: result.title,
                                        brief: result.brief,
                                        thumbnail: result.thumbnail,
                                        content: result.content,
                                        count: 1
                                    })

                                    data_view.save(function (err, data) {
                                        if (err) {
                                            return console.log(err)
                                        }
                                        User.findOne({_id: login.user_id}, function (err, user) {
                                            if (err) {
                                                return console.log(err)
                                            }
                                            user.point++
                                            user.save()
                                            View.count({news_id: req.params.id})
                                                .then(views => {
                                                    return res.json({
                                                        data: result,
                                                        views: views,
                                                        error: null
                                                    })
                                                }) 
                                        })
                                    })
                                } else {
                                    var data_view = View({
                                        news_id: req.params.id,
                                        user_id: login.user_id
                                    })

                                    data_view.save(function (err, data) {
                                        View.count({news_id: req.params.id})
                                            .then(views => {
                                                return res.json({
                                                    data: result,
                                                    views: views,
                                                    error: null
                                                })
                                            })
                                    })
                                }
                            })
                        }
                    }
                }
            })
        } else {
            Location.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
                if (err) {
                    return console.log(err)
                }
                if (news) {
                    for (var i = 0; i < news.news.length; i++) {
                        if (news.news[i].id === req.params.id) {
                            result = news.news[i]
                            var data_view = View({
                                news_id: req.params.id,
                                type: "location",
                                topic_ascii: req.params.topic_ascii,
                                title: result.title,
                                brief: result.brief,
                                thumbnail: result.thumbnail,
                                content: result.content,
                                count: 1
                            })

                            data_view.save(function (err, data) {
                                    View.count({news_id: req.params.id})
                                    .then(views => {
                                        return res.json({
                                            data: result,
                                            views: views,
                                            error: null
                                        })
                                    })
                            })
                        }
                    }
                }
            })
        }
    })

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
    Location.findOne({topic_ascii: req.params.topic_ascii}, function (err, news) {
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