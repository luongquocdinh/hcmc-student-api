var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var argv = require('optimist').argv
var app = express()
var cors = require('cors')
var routes = require('./../routes/index')
var user = require('./../routes/user')
var news = require('./../routes/news')
let path = require('path')

var conf = {
  port: argv.p || 3000
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

module.exports = app
