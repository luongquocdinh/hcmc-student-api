var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Images = require('./../models/images')

var sess;

router.get('/', (req, res) => {
    sess = req.session
    Images.find({})
        .sort({updated_at: -1})
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
    Images.findOne({_id: id})
        .then(data => {
            return res.json({
                data: data,
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