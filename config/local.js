"use strict";
const DEBUG = true;

const Passport = require("passport"),
   LocalStrategy = require('passport-local').Strategy,
   bcrypt = require("bcrypt"),
   dataBase = require("../models");

Passport.use(new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
      // passReqToCallback : true
   },
   function(username, password, done) {
      console.log("user: %s | pass: %s", username, password);
      dataBase.User.findOne({
         where: {
            name: username
         }
      }).then((data) => {
         if (!data) {
            console.log("no user");
            return done(null, false, { message: "username doesn't exist" });
         }
         // decrypt password
         bcrypt.compare(password, data.password, function(err, res) {
            console.log(res); 
            // two possible ways to sign in login/auto sign in when email verified 
            if (res) {
               return done(null, data);
            } else if (password === data.password) {
               return done(null, data);
            }
            console.log("wrong pass");
            return done(null, false, { message: "inccorect password" });
         });
      }).catch((err) => {
         done(err);
      });
   }));

Passport.serializeUser(function(user, done) {
   DEBUG && console.log("---------------------");
   // DEBUG && console.log(user);
   done(null, user.name);
});

Passport.deserializeUser(function(username, done) {
   DEBUG && console.log("////////////////////////");
   dataBase.User.findOne({
      where: {
         name: username
      }
   }).then((user) => {
      done(null, user);
   }).catch((err) => {
      done(err);
   })
});

module.exports = Passport;