var express = require('express')
var path = require('path')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Event = require('./../models/event')

router.get('/', (req, res) => {
    var per_page = 10
    var page = req.query.page || 1
    Event.find({})
        .skip(per_page * (page - 1))
        .limit(per_page)
        .lean()
        .exec()
        .then(data => {
            return res.json({
                data: data,
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

router.get('/:id', (req, res) => {
    var id = req.params.id
    Event.findOne({_id: id})
        .then(data => {
            return res.json({
                data: data,
                error: null
            })
        })
        .catch( err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

module.exports = router
