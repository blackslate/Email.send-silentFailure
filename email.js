if (Meteor.isClient) {
  var to = 'you@example.com' // CHANGE THIS
  var from = 'me@example.com'
  var title = 'Message'
  var message = "message.html"

  Meteor.call(
    'sendEmail'
  , to
  , from
  , title
  , message
  , callback
  )

  function callback(error, data) {
    console.log(error, data)
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {  
    // CHANGE THE MAIL_URL
    process.env.MAIL_URL = 'smtp://me%40example.com:PASSWORK@smtp.example.com:25'

    Meteor.methods({
      sendEmail: function (to, from, subject, file) {
        check([to, from, subject, file], [String])
        
        // HACK TO FIND public/ DIRECTORY IN Meteor 1.2.0.1
        var _public = "../../../../../public/"
        
        var fs = Npm.require('fs')
        var message = fs.readFileSync(_public + file, 'utf8')

        console.log(typeof message, message.length)
        this.unblock()

        try {
          Email.send({
            to: to,
            from: from,
            subject: subject,
            text: message
          })
        } catch (exception) {
          console.log(exception)
        }
      }
    })
  })
}