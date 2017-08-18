let express = require('express')
let path = require('path')

let router = express.Router()

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

let Comment = require('./../models/comment')

router.post('/delete', (req, res) => {
    let id = req.body.id
    Comment.findOne({
        _id: id
    }).remove().exec();
})

module.exports = router