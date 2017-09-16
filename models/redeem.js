var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var redeem = new Schema({
    user_id: {type: String, index: true},
    email: {type: String},
    network: {type: String}, // viettel, mobi, vina
    value: {type: Number},

    created_date: {type: Date, default: Date.now()},
    updated_date: {type: Date, default: Date.now()}
})

var Redeem = mongoose.model('redeem', redeem)

module.exports = Redeem