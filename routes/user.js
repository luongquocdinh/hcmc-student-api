var express = require('express')
var path = require('path')
var crypto = require('crypto')
var session = require('express-session')
var randomString = require('randomstring')
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
    cloudinary.uploader.upload(imageDir, function(result) {
        console.log(result.url)
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
          token: crypto.createHash("sha256").update(fields.email).digest('hex'),
          created_at: new Date(),
          updated_at: new Date()
        })

        User.findOne({ email: fields.email }, function (err, user) {
          if (err) throw err
          if (!user) {
            data.save(function (err) {
              if (err) {
                throw err
              } else {
                sendmail(createMailOpt(data))
                return res.json(responseSuccess("Sign Up Successful", data))
              }
            })
          } else {
            return res.json(responseError("Sign Up Error"))
          }
        })
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
    user.token = randomString.generate()
    user.save()
    return res.json(responseSuccess("Active user successful", user))
  })
})

// Login
router.post('/login', function (req, res) {
  sess = req.session;
  var email = req.body.email
  var password = crypto.createHash("sha256").update(req.body.password).digest('base64')
  let secretKey = randomString.generate()
  User.findOne({ email: email, password: password, is_block: false, is_active: true }, function (err, user) {
    if (!user) {
      return res.json(responseError("Login Feild"))
    } else {
      var data = Login({
        "token": crypto.createHmac('sha256', secretKey).update(user.email).digest('hex'),
        "email": user.email,
        "point": user.point,
        "name": user.name,
        "user_id": user._id,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
      })
      console.log(data)
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
      return res.json(responseError("Logout feild"))
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
  Login.findOne({ token: req.body.token, is_active: true }, function (err, login) {
    if (!login) {
      return res.json(responseError("Error handle"))
    }

    User.findOne({ email: login.email }, function (err, user) {
      if (!user) {
        return res.json(responseError("User not found"))
      } else {
        var oldpassword = crypto.createHash("sha256").update(req.body.oldpassword).digest('base64')
        var newpassword = crypto.createHash("sha256").update(req.body.newpassword).digest('base64')
        if (oldpassword != user.password) {
          return res.json(responseError("Password not match"))
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
      return console.log(err)
    }
    transporter.sendMail(mailRecoverPassword(req.body.email, user.token), (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
    return res.json(responseSuccess("Send mail successful", req.body.email))
  })
})

// Set Password
router.post('/set-password/:token', function (req, res) {
  User.findOne({ token: req.params.token }, function (err, user) {
    if (err) {
      return console.log(err)
    }
    user.password = crypto.createHash("sha256").update(req.body.password).digest('base64')
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
    if (err) return res.json(responseError("Please Login"))
    User.findOne({ email: login.email }, function (err, user) {
      if (err) return res.json(responseError("Please Login"))
      if (user) {
        return res.json(responseSuccess("Your Profile", user))
      } else {
        return res.json(responseError("Please Login"))
      }
    })
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
    return res.json(responseError("Please Login"));
  }
})
module.exports = router
