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
    
})

module.exports = router