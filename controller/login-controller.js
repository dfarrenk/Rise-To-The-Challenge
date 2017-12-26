"use strict";
const DEBUG = true;

// dependencies 
const dataBase = require("../models"),
   bcrypt = require("bcrypt"),
   path = require("path"),
   passport = require("../config/local.js"),
   mailer = require("../config/sendgrid_mailer.js"),
   loginRoute = new require("express").Router();

module.exports = function() {

   loginRoute.get("/login/email_verification", function(req, res) {
      console.log("Okay");
      res.status(200).sendFile(path.join(__dirname, "../public/verification.html"));
   });

   loginRoute.post("/login/email_verification", passport.authenticate("local", {
      // it's unlikely there's failure, however if failure should happen I need a handler
      // could set a timer somehow to nullified expired link
      failureRedirect: "error",
   }), function(req, res) {
      console.log(req.body);
      dataBase.User.update({
         email_verified: true
      }, {
         where: {
            name: req.body.username
         }
      }).then((data) => {
         console.log("success %s", data);
         res.status(200).send("/user/dashboard");
      }).catch((err) => {
         // handling sequelize error only
         if (err.contructor === Array) {
            const errorType = err.errors[0].message;
            errorIdentifier(errorType);
         } else {
            console.log(err.message);
         }
      });
   });

   loginRoute.post("/login", passport.authenticate("local", {
      // successRedirect: "/user/dashboard",
      failureRedirect: "/",
      failureFlash: false
   }), function(req, res) {
      if (req.path.length > 6) {
         // get from req.path
         const queryString = req.path.substring(1),
         const userData = queryString.replace(/[a-z](?:[=])/g, "").split("&"),
         userObj = {
            challenger_id: userData[0],
            instance_id: userData[1]
         };

         dataBase.Instance.update({
            accepter_id: req.user.id
         }, {
            where: {
               id: userData.instance_id,
               issuer_id: userData.challenger_id
            }
         });
      }
   });

   loginRoute.post("/login/account", function(req, res) {//new user account creation route linked to route in challenge js
      console.log(req.body);

      // if (req.challenge_id) {...}

      bcrypt.hash(req.body.password, 10, function(err, hash) {
         // Store hash in your password DB.
         dataBase.User.create({
            name: req.body.username || req.body.name, // please move html to public/
            password: hash,
            alias: req.body.alias || req.body.username,
            email: req.body.email
         }).then(() => {
            // mailer(options, flag);
            mailer({ 
               email: req.body.email, 
               username: req.body.username, 
               password: hash
            }, 0);

            res.status(201).send("Registered..please verify your email address");
         }).catch((err) => {
            // handling sequelize error only
            if (err.contructor === Array) {
               const errorType = err.errors[0].message;
               errorIdentifier(errorType);
            } else {
               console.log(err.message);
            }
         });
      });
   });

   return loginRoute;
}

function errorIdentifier(errtype) {
   console.error(errtype);
   // identify error type using regex to match key word
   if (!!errtype.match(/\w*(?:name)/g)) {
      return res.status(409).send("Username taken");
   }

   if (!!errtype.match(/\w*(?:password)/g)) {
      return res.status(406).send("Invalid password format");
   }

   return res.status(400).send("Bad request");
}