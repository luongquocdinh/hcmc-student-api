let express = require('express')
let path = require('path')
let formidable = require('formidable')
let session = require('express-session')
let fs = require('fs')
let util = require('util');
let moment = require('moment')

let router = express.Router()

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

let User = require('./../models/user')
let Login = require('./../models/login')
let News = require('./../models/news')
let View = require('./../models/view')
let Comment = require('./../models/comment')

let per_page = 10;

// API get list News
router.get('/', function (req, res) {
    let response = []
    News.find({source: 'news', is_accept: true})
        .sort({datetime: -1})
        .then(data => {
            let topic = []
            let keys = []
            let news = {}
            let prev

            for (let i = 0; i < data.length; i++) {
                topic.push(data[i].topic)
            }
            topic.sort()
            for (let i = 0; i < topic.length; i++) {
                if (topic[i] !== prev) {
                    keys.push(topic[i])
                }
                prev = topic[i]
            }
            
            for (let i = 0; i < keys.length; i++) {
                let index = 1
                news[keys[i]] = []
                for (let j = 0; j < data.length; j++) {
                    if (keys[i] == data[j].topic && index <= 4) {
                        news[keys[i]].push({
                            id: data[j]._id,
                            topic_ascii: data[j].topic_ascii,
                            title: data[j].title,
                            brief: data[j].brief,
                            thumbnail: data[j].thumbnail,
                            datetime: data[j].datetime,
                            views: data[j].views
                        })
                        index++;
                    }
                }
            }
            return res.json(responseSuccess("Tin Tức", news));
        }).catch(err => {
            return res.json(responseError('Request Not Found'));
        })
})

// API get list news by topic
router.get('/:topic_ascii', function (req, res) {
    let page = req.query.page || 1;
    let topic_ascii = req.params.topic_ascii;
    News.find({topic_ascii: topic_ascii, is_accept: true})
        .sort({datetime: -1})
        .skip(per_page * (page - 1))
        .limit(per_page)
        .then(data => {
            let response = []
            let topic
            data.map(r => {
                topic = r.topic
                response.push({
                    id: r._id,
                    topic_ascii: r.topic_ascii,
                    title: r.title,
                    brief: r.brief,
                    thumbnail: r.thumbnail,
                    datetime: r.datetime,
                    views: r.views
                })
            })
            let result = {
                total_page: Math.ceil(data.length / per_page),
                page,
                per_page,
                response
            }
            return res.json(responseSuccess(topic, result));
        }).catch(err => {
            return res.json(responseError('Request Not Found'));
        })
})

// API get news
router.get('/:topic_ascii/:id', function (req, res) {
    let topic_ascii = req.params.topic_ascii
    let id = req.params.id
    Login.findOne({ token: req.headers.token }, function (err, login) {
        if (login) {
            News.findOne({_id: id})
                .then(data => {
                    data.views++
                    data.save()
                    let result = {
                        title: data.title,
                        brief: data.brief,
                        thumbnail: data.thumbnail,
                        datetime: data.datetime,
                        content: data.content,
                        author: data.author,
                        views: data.views
                    }
                    View.findOne({
                        $and: [
                            {news_id: req.params.id, user_id: login.user_id}
                        ]
                    }).then(r => {
                        if (!r) {
                            let data_view = View({
                                news_id: id,
                                user_id: login.user_id,
                                type: "news",
                                topic_ascii: topic_ascii,
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
                                    user.point = user.point + 10
                                    user.save()
                                    return res.json({
                                        data: result,
                                        error: null
                                    })
                                })
                            })
                        } else {
                            return res.json({
                                data: result,
                                error: null
                            })
                        }
                    })
                })
        } else {
            News.findOne({_id: id})
                .then(data => {
                    data.views++;
                    data.save();
                    let result = {
                        title: data.title,
                        brief: data.brief,
                        thumbnail: data.thumbnail,
                        datetime: data.datetime,
                        content: data.content,
                        author: data.author,
                        views: data.views
                    }
                    return res.json({
                        data: result,
                        error: null
                    })
                })
        }
    })

})

module.exports = router