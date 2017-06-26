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

let per_page = 10;

router.get('/', (req, res) => {
    let page = req.query.page || 1
    let response = []
    News.find({})
        .sort({views: -1})
        .skip(per_page * (page - 1))
        .limit(per_page)
        .then(data => {
            let response = []
            data.map(r => {
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
            return res.json(responseSuccess("Tin Hot", result));
        })
})

module.exports = router;