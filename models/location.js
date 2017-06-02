var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var location = new Schema({
    topic: {type: String},
    topic_ascii: {type: String},
    is_enable: {type: Boolean},
    news: [{
        title: {type: String},
        thumbnail: {type: String},
        brief: {type: String},
        content: {type: String},
        is_accept: {type: Boolean},
        concern: {type: String},
        created_at: { type: Date, default: Date.now},
        updated_at: { type: Date, default: Date.now}
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
},
{ versionKey: false }
)

var Location = mongoose.model('location', location)

module.exports = Location