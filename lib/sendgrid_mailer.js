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
   challenge_name: "",
   challenger_id: 0,
   challenger_name: "",
   instance_id: ""
};

// flag tells mailer which template to use
// email({ options }, flag);
// obj key name: email, username, password, challenge_id, challenge_proof
module.exports = function(hostname, options = email_options, flag) {
   DEBUG && console.log(options);
   const __ = require("./email_templates/content.js")(options);

   // need to work out a pattern
   const hrefLink = hostname + __.routes[flag],
      customContent = {
         "%username%": options.username,
         "%challengename%": options.challenge_name,
         "%challenger%": options.challenger_name,
         "%image%": __.imageLinks[flag],
         "%link%": hrefLink,
         "%linktext%": __.linktext[flag]
      };

   // original regexp: /(?=[%])(?:.*[a-z])(?:[%])/gi
   const mailContent = emailTemplates[__.flag_name[flag]].replace(/\%\w+(?![>])?\%/gi, (matched) => {
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
            subject: __.subjects[flag], // array
         }],
         from: {
            email: 'risetochallengeteam@challenge.org'
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
      console.log(error.body);
      console.log(error.headers);
      console.log(error.response.statusCode);
   });
}