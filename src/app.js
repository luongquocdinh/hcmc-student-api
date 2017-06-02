var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var argv = require('optimist').argv
var app = express()
var cors = require('cors')
var routes = require('./../routes/index')
var user = require('./../routes/user')
var news = require('./../routes/news')
var activity = require('./../routes/activity')
var gift = require('./../routes/gift')
var event = require('./../routes/event')
var hot = require('./../routes/hot_news')
var images = require('./../routes/images')
var location = require('./../routes/location')
let path = require('path')

app.use(session({
  secret: 'hcmc-student',
  saveUninitialized: true,
  resave: true
}));

var conf = {
  port: process.env.PORT || 9000
}

app.set('port', conf.port)
app.use(cors())

app.use('/public', express.static(path.join(__dirname, './../public')))
app.set('views', path.join(__dirname, './../views'))
app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(express.query())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use('/', routes)
app.use('/user', user)
app.use('/news', news)
app.use('/activity', activity)
app.use('/gift', gift)
app.use('/event', event)
app.use('/hot', hot)
app.use('/location', location)
app.use('/images', images)

module.exports = app
