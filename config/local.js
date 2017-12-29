"use strict";
const DEBUG = true;

const Passport = require("passport"),
   LocalStrategy = require('passport-local').Strategy,
   bcrypt = require("bcrypt"),
   token = require("./token.js"),
   dataBase = require("../models");

Passport.use(new LocalStrategy({
      usernameField: "username",
      passwordField: "password"
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

// async function serializeCallback(user, done) {
//    DEBUG && console.log("---------------------");
//    // DEBUG && console.log(user.dataValues);
//    const tokenObj = await token.genToken(user.dataValues);
//    DEBUG && console.log(tokenObj);

//    token[tokenObj.name] = tokenObj;
//    token[tokenObj.name].timeout(token);

//    done(null, tokenObj.name);
//    // done(null, user.name);
// }

Passport.serializeUser(function(user, done) {
   DEBUG && console.log("---------------------");
   // DEBUG && console.log(user.dataValues);
   token.genToken(user.dataValues).then((tokenObj) => {
      DEBUG && console.log(tokenObj);

      token[tokenObj.name] = tokenObj;
      token[tokenObj.name].timeout(token);

      done(null, tokenObj.name);
      // done(null, user.name);   
   });
});

Passport.deserializeUser(function(tokenKey, done) {
   DEBUG && console.log("////////////////////////");

   const username = !!token[tokenKey] ? token[tokenKey].info.name : "empty";
   DEBUG && console.log(username);

   dataBase.User.findOne({
      where: {
         name: username
      }
   }).then((user) => {
      done(null, user);
   }).catch((err) => {
      done(err);
   });
});

module.exports = Passport;