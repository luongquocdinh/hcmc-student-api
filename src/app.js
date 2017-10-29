let express = require('express')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let argv = require('optimist').argv
let app = express()
let cors = require('cors')
let routes = require('./../routes/index')
let user = require('./../routes/user')
let news = require('./../routes/news')
let activity = require('./../routes/activity')
let gift = require('./../routes/gift')
let event = require('./../routes/event')
let hot = require('./../routes/hot_news')
let images = require('./../routes/images')
let location = require('./../routes/location')
let comment = require('./../routes/comment')
let redeem = require('./../routes/redeem')
let reward = require('./../routes/reward')

let path = require('path')

var schedule = require('node-schedule');
let crawler = require('./../crawler/index');

app.use(session({
  secret: 'hcmc-student',
  saveUninitialized: true,
  resave: true
}));

let conf = {
  port: process.env.PORT || 9090
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

schedule.scheduleJob('0 * * * *', function() {
  crawler.detail();
});

schedule.scheduleJob('0 * * * *', function() {
  crawler.link();
});

app.use('/', routes)
app.use('/user', user)
app.use('/news', news)
app.use('/activity', activity)
app.use('/gift', gift)
app.use('/event', event)
app.use('/hot', hot)
app.use('/location', location)
app.use('/images', images)
app.use('/comment', comment)
app.use('/redeem', redeem)
app.use('/reward', reward)

module.exports = app
