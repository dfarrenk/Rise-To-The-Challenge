const DEBUG = true;

const Passport = require("passport"),
   LocalStrategy = require('passport-local').Strategy,
   dataBase = require("../models");

Passport.use(new LocalStrategy({
      usernameField: "user_name",
      passwordField: "user_pass",
   },
   function(username, password, done) {
      dataBase.User.findOne({
         where: {
            name: username
         }
      }).then((data) => {
         if (!data) {
         	console.log("no user");
            return done(null, false, { message: "username doesn't exist" });
         }
         if (data.password !== password) {
            console.log("wrong pass");
            return done(null, false, { message: "inccorect password" });
         }
         return done(null, data);
      }).catch((err) => {
         done(err);
      });
   }));

console.log("hello");

Passport.serializeUser(function(user, done) {
   console.log("---------------------");
   console.log(user);

   done(null, user.name);
});

Passport.deserializeUser(function(username, done) {
   console.log("////////////////////////");
   console.log(username);
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