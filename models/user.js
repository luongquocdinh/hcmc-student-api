var mongoose = require('mongoose')
var Schema = mongoose.Schema

var users = new Schema({
  "name": String,
  "email": String,
  "password": String,
  "avatar": String,
  "phone": Number,
  "is_block": Boolean,
  "is_active": Boolean,
  "school": String,
  "code_school": String,
  "role": String,
  "token": String,
  "point": Number,
  "created_at": { type: Date },
  "updated_at"    : { type: Date }
},
{ versionKey: false })

var User = mongoose.model('users', users)

module.exports = User
