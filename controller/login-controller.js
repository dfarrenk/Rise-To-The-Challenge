"use strict";
const DEBUG = true;

// dependencies
const dataBase = require("../models"),
   bcrypt = require("bcrypt"),
   path = require("path"),
   passport = require("../config/local.js"),
   mailer = require("../config/sendgrid_mailer.js"),
   userTimeout = require("../config/verification_timeout.js"),
   loginRoute = new require("express").Router();

module.exports = function() {

   loginRoute.get("/login/email_verification", function(req, res) {
      DEBUG && console.log("Okay");
      res.status(200).sendFile(path.join(__dirname, "../public/verification.html"));
   });

   loginRoute.post("/login/email_verification", passport.authenticate("local", {
      // it's unlikely there's failure, however if failure should happen I need a handler
      // could set a timer somehow to nullified expired link
      failureRedirect: "error",
   }), function(req, res) {
      DEBUG && console.log(req.user);
      dataBase.User.update({
         email_verified: true
      }, {
         where: {
            name: req.body.username
         }
      }).then((data) => {
         DEBUG && console.log("success %s", data);
         res.status(200).send("/user/dashboard");
      }).catch((err) => {
         // handling sequelize error only
         if (err.errors && err.errors.constructor === Array) {
            const errorType = err.errors[0].message;
            return errorIdentifier(res, errorType);
         }
         else {
            DEBUG && console.error(err.message);
         }
      });
   });

   loginRoute.post("/login", passport.authenticate("local", {
      // successRedirect: "/user/dashboard",
      // failureRedirect: ,
      // failureFlash: true
   }), function(req, res) {
      DEBUG && console.log(req.user);
      DEBUG && console.log(req.query["challenger"]);

      userTimeout(req.user.dataValues).activateTimeout();
      if (req.query["challenger"]) {
         dataBase.Instance.update({
            accepter_id: req.user.id
         }, {
            where: {
               challenge_id: req.query["instance"],
               issuer_id: req.query["challenger"]
            }
         }).then((data) => {
            DEBUG && console.log("success");
            return res.status(200).send("/user/dashboard");
         });
      }
      else {
         res.status(200).send("/user/dashboard");
      }
   });

   loginRoute.post("/login/new_user", function(req, res) { //new user account creation route linked to route in challenge js
      DEBUG && console.log(req.body);

      // if (req.challenge_id) {...}

      bcrypt.hash(req.body.password, 10, function(err, hash) {
         // Store hash in your password DB.
         dataBase.User.create({
            name: req.body.username, // please move html to public/
            password: hash,
            alias: req.body.alias || req.body.username,
            email: req.body.email
         }).then((data) => {
            // mailer(options, flag);
            mailer({
               email: req.body.email,
               username: req.body.username,
               password: hash
            }, 0);

            res.status(201).send(data);
            // userTimeout(data.dataValues).activateTimeout();
         }).catch((err) => {
            // handling sequelize error only
            if (err.errors && err.errors.constructor === Array) {
               const errorType = err.errors[0].message;
               return errorIdentifier(res, errorType);
            }
            else {
               DEBUG && console.error(err.message);
            }
         });
      });
   });

   return loginRoute;
};

function errorIdentifier(res, errortype) {
   DEBUG && console.error(errortype);
   // identify error type using regex to match key word
   if (!!errortype.match(/\w*(?:name)/g)) {
      return res.status(409).send("username-taken");
   }

   if (!!errortype.match(/\w*(?:password)/g)) {
      return res.status(406).send("Invalid password format");
   }

   return res.status(400).send("Bad request");
}
