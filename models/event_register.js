var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var event_register = new Schema({
    event_id: {type: String, index: true},
    email: {type: String},
    phone: {type: String},
    name: {type: String},
})

var eventRegister = mongoose.model('event_register', event_register)

module.exports = eventRegister;