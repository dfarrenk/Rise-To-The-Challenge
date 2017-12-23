"use strict";
const DEBUG = true;

require("dotenv").config();

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY),
   fs = require("fs"),
   path = require("path"),
   template_filepath = path.join(__dirname, "/email_templates");

// missing image for email verification, 0 = veri, 1 = chal_issue, 2 = chal_accept, chal_complete
const imagelinks = [
   "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
   "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
   "https://media.giphy.com/media/H34dW1FHF4JmE/giphy.gif",
   "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif"
];

const fileImport = function(filepath) {
   const data = fs.readFileSync(filepath, "utf8");
   return data;
};

const emailTemplates = new Array();

// there are two possible way to create custom email,
// one with prewritten pages another with template + prewritten contents 
fs.readdirSync(template_filepath).filter((file) => {
   return (file.indexOf('.') !== 0) && (file.slice(-5) === '.html');
}).forEach((file) => {
   const filepath = path.join(template_filepath, file),
      html = fileImport(filepath);
   emailTemplates.push(html);
});

DEBUG && console.log(fs.readdirSync(__dirname + "/email_templates"));
DEBUG && console.log(emailTemplates);

// flag tells mailer which template to use
module.exports = function(email, username, hash, flag) {

   // need to work out a pattern
   const hrefLink = "http://localhost:8080/login/email_verification?",
      customContent = {
         "%username%": username,
         "%image%": imagelinks[flag],
         "%link%": `<a href=${hrefLink + "u=" + username + "&p=" + hash}>${"Click me to verify"}</a>`
      };

   const mailContent = emailTemplates[flag].replace(/(?=[%])(?:.*[a-z])(?:[%])/gi, (matched) => {
      return customContent[matched];
   });

   DEBUG && console.log(mailContent);

   const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
         personalizations: [{
            to: [{
               email: email
            }],
            subject: 'Rise to Challenge',
         }],
         from: {
            email: 'risetochallengeteam@brave.org'
         },
         content: [{
            type: 'text/html',
            value: mailContent
         }]
      },
      tracking_settings: {
         click_tracking: {
            enable: false
         }
      }
   });

   // With promise
   sg.API(request).then(function(response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
   }).catch(function(error) {
      // error is an instance of SendGridError
      // The full response is attached to error.response
      console.log(error.response.statusCode);
   });
}