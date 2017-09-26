var mongoose = require('mongoose')
var Schema = mongoose.Schema

var feedback_comment = new Schema({
    "user_id": {type: String},
    "comment_id": {type: String}, 
    "created_at": { type: Date, default: Date.now()},
    "updated_at"    : { type: Date, default: Date.now() }
})

var feedbackComment = mongoose.model('feedback_comment', feedback_comment)

module.exports = feedbackComment