var mongoose = require('mongoose')
var Schema = mongoose.Schema

var view = new Schema({
    "news_id": {type: String},
    "user_id": {type: String},
    "created_at": { type: Date, default: Date.now() },
    "updated_at"    : { type: Date, default: Date.now() }
})

var View = mongoose.model('view', view)

module.exports = View