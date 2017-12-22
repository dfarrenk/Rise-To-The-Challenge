"use strict";
const DEBUG = true; 

module.exports = function(email, username) {
   require("dotenv").config();
   const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
   
   DEBUG && console.log("______________" + process.env.SENDGRID_API_KEY);
   const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
         personalizations: [{
            to: [{
               email: email
            }],
            subject: 'Sending with SendGrid is Fun'
         }],
         from: {
            email: 'risetochallengeteam@brave.org'
         },
         content: [{
            type: 'text/html',
            value: `<p>Dear ${username},</p>
                <p>Welcome to Rise to Challenge, please verified your email before using the app</p>
                <br><br><img src="https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif"/>
                <a href="localhost:8080/emailverification/">Click me to verify</a>`
         }]
      }
   });

   // With promise
   sg.API(request)
      .then(function(response) {
         console.log(response.statusCode);
         console.log(response.body);
         console.log(response.headers);
      })
      .catch(function(error) {
         // error is an instance of SendGridError
         // The full response is attached to error.response
         console.log(error.response.statusCode);
      });

   // With callback
   sg.API(request, function(error, response) {
      if (error) {
         console.log('Error response received');
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
   });

}