var express = require('express')
var path = require('path')
var router = express.Router()

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.second = 30;

router.get('/', function (req, res) {
    res.end("test")
})

module.exports = router