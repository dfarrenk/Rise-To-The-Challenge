"use strict";
const DEBUG = true;

require("dotenv").config();

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY),
   fs = require("fs"),
   path = require("path"),
   template_filepath = path.join(__dirname, "/email_templates");

const fileImport = function(filepath) {
   const data = fs.readFileSync(filepath, "utf8");
   return data;
};

const emailTemplates = {};
// there are two possible way to create custom email,
// one with prewritten pages another with template + prewritten contents 
fs.readdirSync(template_filepath).filter((file) => {
   return (file.indexOf('.') !== 0) && (file.slice(-5) === '.html');
}).forEach((file) => {
   const filepath = path.join(template_filepath, file),
      html = fileImport(filepath);
   emailTemplates[file] = html;
});

DEBUG && console.log(fs.readdirSync(__dirname + "/email_templates"));
DEBUG && console.log(emailTemplates);

const email_options = {
   email: "",
   username: null,
   password: null,
   challenge_id: 0,
   challenger_name: "",
   challenge_proof: ""
};

// flag tells mailer which template to use
// email({ options }, flag);
// obj key name: email, username, password, challenge_id, challenge_proof
module.exports = function(options = email_options, flag) {

   // missing image for email verification, 0 = veri, 1 = chal_issue, 2 = chal_accept, chal_complete
   const imageLinks = [
         "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
         "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
         "https://media.giphy.com/media/H34dW1FHF4JmE/giphy.gif",
         "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif"
      ],
      routes = [
         "/login/email_verification?u=" + options.username + "&p=" + options.password,
         "/user/arChallenge?challenger=" + options.challenger_name + "&challenge_id=" + options.challenge_id,
      ],
      linktext = [
         "Click me to verify",
         "Click to know more about the challenge"
      ], 
      flag_name = [
         "email_verification.html",
         "email_chalrecipient.html",
      ];

   // need to work out a pattern
   const hrefLink = "http://localhost:8080" + routes[flag],
      customContent = {
         "%username%": options.username,
         "%challenger": options.challenger_name,
         "%image%": imageLinks[flag],
         "%link%": hrefLink,
         "%linktext%": linktext[flag]
      };

   // original regexp: /(?=[%])(?:.*[a-z])(?:[%])/gi
   const mailContent = emailTemplates[flag_name[flag]].replace(/\%?\w+(?![>])?\%/gi, (matched) => {
      return customContent[matched];
   });

   DEBUG && console.log(mailContent);

   const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
         personalizations: [{
            to: [{
               email: options.email
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