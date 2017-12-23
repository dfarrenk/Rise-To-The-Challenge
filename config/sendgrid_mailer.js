"use strict";
const DEBUG = true;

const fs = require("fs"),
   path = require("path"),
   template_filepath = path.join(__dirname, "/email_templates"),
   emailTemplates = new Array(),
   fileImport = function(filepath) {
      const data = fs.readFileSync(filepath, "utf8");
      return data;
   };

// read html template
fs
   .readdirSync(template_filepath)
   .filter((file) => {
      return (file.indexOf('.') !== 0) && (file.slice(-5) === '.html');
   })
   .forEach((file) => {
      const filepath = path.join(template_filepath, file);
      console.log(filepath);
      const html = fileImport(filepath);
      emailTemplates.push(html);
   });

// missing image for email verification, 0 = veri, 1 = chal_issue, 2 = chal_accept, chal_complete
const imagelinks = [
   "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
   "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
   "https://media.giphy.com/media/H34dW1FHF4JmE/giphy.gif",
   "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif"
];

// flag tells mailer which template to use
module.exports = function(email, username, hash, flag) {
   require("dotenv").config();
   const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

   DEBUG && console.log(fs.readdirSync(__dirname + "/email_templates"));
   DEBUG && console.log(emailTemplates);

   const hrefLink = "http://localhost:8080/login/email_verification?";


   const customContent = {
         "%username%": username,
         "%image%": imagelinks[flag],
         "%link%": `<a href=${hrefLink + "u=" + username + "&p=" + hash}>${"Click me to verify"}</a>`
      },
      mailContent = emailTemplates[flag].replace(/(?=[%])(?:.*[a-z])(?:[%])/gi, (matched) => {
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
      // footer: {
      //    enable: true,
      //    html: `<footer style="text-align: center;">© SendGrid Inc. 1801 California St. Suite 500, Denver, CO 80202 USA</footer>`
      // },
      tracking_settings: {
         click_tracking: {
            enable: false
         }
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
   // sg.API(request, function(error, response) {
   //    if (error) {
   //       console.log('Error response received');
   //    }
   //    console.log(response.statusCode);
   //    console.log(response.body);
   //    console.log(response.headers);
   // });
}