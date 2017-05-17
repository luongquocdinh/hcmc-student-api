var apiConfig = require('./mailconfig.json')
var sendgridModule = require('sendgrid')
var helper = sendgridModule.mail
var sendgrid = sendgridModule(apiConfig.API_key)

module.exports = function (mailOptions) {
  var fromEmail = new helper.Email(mailOptions.from, mailOptions.fromname)
  var toEmail = new helper.Email(mailOptions.to)
  var content = new helper.Content('text/html', mailOptions.html)
  var mail = new helper.Mail(fromEmail, mailOptions.subject, toEmail, content)
  var request = sendgrid.emptyRequest({
    method: apiConfig.method,
    path: apiConfig.path,
    body: mail.toJSON()
  })
  return sendgrid.API(request)
}