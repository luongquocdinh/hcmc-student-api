var mongoose = require('mongoose')
var Schema = mongoose.Schema

var login = new Schema({
  "email": String,
  "token": String,
  "is_active": Boolean,
  "name": String,
  "phone": String,
  "point": Number,
  "avatar": String,
  "user_id": String,
  "created_at": { type: Date },
  "updated_at"    : { type: Date }
})

var Login = mongoose.model('login', login)

module.exports = Login
