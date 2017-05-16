var mongoose = require('mongoose')
var Schema = mongoose.Schema

var comment = new Schema({
    "news_id": {type: String},
    "user_id": {type: String},
    "topic_id": {type: String},
    "username": {type: String},
    "content": {type: String},
    "created_at": { type: Date, default: Date.now()},
    "updated_at"    : { type: Date, default: Date.now() }
})

var Comment = mongoose.model('comment', comment)

module.exports = Comment