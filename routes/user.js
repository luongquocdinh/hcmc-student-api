var express = require('express')
var path = require('path')
var crypto = require('crypto')
var session = require('express-session')
var randomstring = require('randomstring')
// var nodemailer = require('nodemailer')
var formidable = require('formidable')
var fs = require('fs')

let sendmail = require('./../configMail/MailSenderPromise.js')
let createMailOpt = require('./../configMail/mailOptions.js')

var router = express.Router()

// var mailOptions = require('./../config/mailOptions')
var mailRecoverPassword = require('./../configMail/mailRecoverPassword')

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var User = require('./../models/user')
var Login = require('./../models/login')
var FeedBack = require('./../models/feedback')
var FeedBackComment = require('./../models/feedback_comment');

var sess;

var cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: 'hwjtqthls', 
  api_key: '174213315926813', 
  api_secret: 'QgfzJyPCJBSjdkWqPTuBWeSc3D4' 
});

// Sign Up
router.post('/', function (req, res) {
  var form = new formidable.IncomingForm()

  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = path.join(__dirname, './../uploads/avatar')

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log('Error is: ' + err)
    }
    var imageDir = files.avatar.path
    var images = ''

    User.findOne({ email: fields.email }, function (err, user) {
      if (err) throw err
      if (!user) {
        cloudinary.uploader.upload(imageDir, function(result) {
          images = result.url
          var data = User({
            name: fields.name,
            email: fields.email,
            password: crypto.createHash("sha256").update(fields.password).digest('base64'),
            phone: fields.phone,
            avatar: images,
            is_block: false,
            is_active: false,
            point: 0,
            role: 'user',
            token: randomstring.generate({
                length: 7,
                charset: 'alphanumeric'
            }),
            created_at: new Date(),
            updated_at: new Date()
          })
  
          data.save(function (err) {
            if (err) {
              throw err
            } else {
              sendmail(createMailOpt(data))
              return res.json(responseSuccess("Sign Up Successful", data))
            }
          })
        })
      } else {
        return res.status(400).json(responseError("Email exist"))
      }
    })
  })
})

// Active User
router.get('/active/:token', function (req, res) {
  User.findOne({ token: req.params.token }, function (err, user) {
    if (err) {
      return console.log(err)
    }
    user.is_active = true
    user.token = randomstring.generate({
        length: 8,
        charset: 'alphanumeric'
    })
    user.save()
    return res.json(responseSuccess("Active user successful", user))
  })
})

// Login
router.post('/login', function (req, res) {
  sess = req.session;
  var email = req.body.email
  var password = crypto.createHash("sha256").update(req.body.password).digest('base64')
  let secretKey = randomstring.generate()
  User.findOne({ email: email, password: password, is_block: false, is_active: true }, function (err, user) {
    if (!user) {
      return res.status(400).json(responseError("Login Feild"))
    } else {
      
      var data = Login({
        "token": crypto.createHmac('sha256', secretKey).update(user.email).digest('hex'),
        "email": user.email,
        "point": user.point,
        "name": user.name,
        "phone": user.phone,
        "avatar": user.avatar,
        "user_id": user._id,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
      })
      
      data.save(function (err) {
        if (err) {
          return console.log(err)
        }
        sess.email = user.email
        sess.name = user.name
        sess.user_id = user._id
        sess.point = user.point
        
        return res.json(responseSuccess("Login successful", data))
      })
    }
  })
})

// Logout
router.post('/logout', function (req, res) {
  var token = req.body.token
  Login.findOne({ token: token, is_active: true }, function (err, user) {
    if (!user) {
      return res.status(400).json(responseError("Logout feild"))
    } else {
      user.is_active = false
      user.updated_at = new Date()
      user.save()
      return res.json(responseSuccess("Logout successful", user))
    }
  })
})

// Change Password
router.post('/change-password', function (req, res) {
  Login.findOne({ token: req.headers.token, is_active: true }, function (err, login) {
    if (!login) {
      return res.status(400).json(responseError("Error handle"))
    }

    User.findOne({ email: login.email }, function (err, user) {
      if (!user) {
        return res.status(400).json(responseError("User not found"))
      } else {
        var oldpassword = crypto.createHash("sha256").update(req.body.oldpassword).digest('base64')
        var newpassword = crypto.createHash("sha256").update(req.body.newpassword).digest('base64')
        if (oldpassword != user.password) {
          return res.status(400).json(responseError("Password not match"))
        } else {
          user.password = newpassword
          user.save()
          return res.json(responseSuccess("Change Password successful", user))
        }
      }
    })
  })
})

// Fotgot Password
router.post('/recover-password', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).json(responseError("Server Error"))
    }
    if (user) {
      sendmail(mailRecoverPassword(req.body.email, user.token));
      return res.json(responseSuccess("Send mail successful", req.body.email))
    } else {
      return res.status(401).json(responseError("User not exits"));
    }
      
  })
})

// Set Password
router.post('/set-password', function (req, res) {
  User.findOne({ token: req.body.token }, function (err, user) {
    if (err) {
      return console.log(err)
    }
    user.password = crypto.createHash("sha256").update(req.body.password).digest('base64')
    user.token = crypto.createHash("sha256").update(user.email + req.body.password).digest('base64')
    user.save()

    return res.json(responseSuccess("Set Password successful", user))
  })
})

// Update profile
router.post('/profile', function (req, res) {
  Login.findOne({ token: req.headers.token }, function (err, login) {
    if (err) return console.log(err)
    User.findOne({ email: login.email }, function (err, user) {
      if (err) return console.log(err)
      var form = new formidable.IncomingForm()

      let avatar = ''
      let dirImage = ''

      form.multiples = true
      form.keepExtensions = true
      form.uploadDir = path.join(__dirname, './../uploads/avatar')

      form.parse(req, function (err, fields, files) {
        if (files.avatar.size != 0) {
          avatar = files.avatar.path
           cloudinary.uploader.upload(avatar, function(result) {
              dirImage = result.url
              user.name = fields.name
              user.email = fields.email
              user.phone = fields.phone
              user.avatar = dirImage
              user.updated_at = new Date()
              user.save()
          return res.json(responseSuccess("Update profile successful", user))
           })
        } else {
          user.name = fields.name
          user.email = fields.email
          user.phone = fields.phone
          user.updated_at = new Date()
          user.save()
          return res.json(responseSuccess("Update profile successful", user))
        }
      })
    })
  })
})

// Profile
router.get('/profile', function (req, res) {
  Login.findOne({ token: req.headers.token }, function (err, login) {
    if (err) return res.status(400).json(responseError("Please Login"))
    if (login) {
      User.findOne({ email: login.email }, function (err, user) {
        if (err) return res.status(400).json(responseError("Please Login"))
        if (user) {
          return res.json(responseSuccess("Your Profile", user))
        } else {
          return res.status(400).json(responseError("Please Login"))
        }
      })
    } else {
      return res.status(400).json(responseError("Please Login"))
    }
  })
})

// FeedBack
router.post('/feedback', function (req, res) {
  var title = req.body.title
  var content = req.body.content
  if (sess.email) {
    var data = FeedBack({
      title: title,
      content: content,
      user_mail: sess.email
    })

    data.save(function (err) {
      if (err) {
        return console.log(err)
      }

      return res.json(responseSuccess("Feedback", data));
    })
  } else {
    return res.status(400).json(responseError("Please Login"));
  }
})

router.post('/feedback/comment', (req, res) => {
  let token = req.headers.token;
  let comment_id = req.body.comment_id

  Login.findOne({token: token})
    .then(login => {
      if (!login) {
        return res.status(401).json(responseError("Please Login"));
      }
      return login;
    })
    .then(login => {
      let data = FeedBackComment({
        user_id: login.user_id,
        comment_id: comment_id
      });

      data.save();
      return res.json(responseSuccess("report comment success", data));
    })
    .catch(err => {
      return res.status(400).json(responseError("Bad request"));
    })
})
module.exports = router
