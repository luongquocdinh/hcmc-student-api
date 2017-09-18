var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

var link = new Schema({
    source_id: {type: Schema.Types.ObjectId, index:true},
    link: {type: String, index: true},
    is_enable: {type: Boolean, default: true}
});

var Link = mongoose.model('link', link);

module.exports = Link;