'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
module.exports = function(email, username, flag) {
   nodemailer.createTestAccount((err, account) => {

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: "risetochallengeteam@gmail.com",
            pass: "risetochallenge"
         }
      });

      // setup email data with unicode symbols
      let mailOptions = {
         from: '"Rise to Challenge 👻" <risetochallengeteam@gmail.com>', // sender address
         to: email, // list of receivers
         subject: 'Please verified your email', // Subject line
         html: `<p>Dear ${username},</p>
                <p>Welcome to Rise to Challenge, please verified your email before using the app</p>
                <br><br><img src="https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif"/>
                <a href="localhost:8080/emailverification/">Click me to verify</a>` // html body // fs to read file
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            return console.log(error);
         }
         console.log('Message sent: %s', info.messageId);
         // Preview only available when sending through an Ethereal account
         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
   });
}