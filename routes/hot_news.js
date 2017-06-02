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
var Activity = require('./../models/activity')
var Gift = require('./../models/gift')
var View = require('./../models/view')
var Comment = require('./../models/comment')

var sess;
var per_page = 10;

router.get('/', function (req, res) {
    var page = req.query.page || 1
    let response = []
    var start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
     return new Promise(resolve => {
           return View.aggregate(
                [
                    // {
                    //     "$match": {
                    //         updated_at: {
                    //             "$gte": start,
                    //         }
                    //     }
                    // },
                    {
                        "$group": {
                            "_id": {
                                news_id: "$news_id",
                                type: "$type",
                                topic_ascii: "$topic_ascii",
                                title: "$title",
                                brief: "$brief",
                                thumbnail: "$thumbnail",
                                content: "$content"
                            },
                            "value": {"$sum": "$count"}
                        }
                    },
                    { "$sort": {"value" : -1} },
                ],
                function(err, result) {
                    for (var i = 0; i < result.length; i++) {
                        response.push({
                            news: result[i]._id,
                            views: result[i].value
                        })
                    }
                    resolve(response);
                }
            )
     }).then(data => {
         let news = data.slice((page - 1)*per_page, per_page*page)
         return res.json({
             data: news,
             error: null
         })
     }).catch(err => {
         return res.json({
             data: null,
             error: err
         })
     })
})

module.exports = router