const DEBUG = true;

const Passport = require("passport"),
   LocalStrategy = require('passport-local').Strategy,
   bcrypt = require("bcrypt"),
   dataBase = require("../models");

Passport.use(new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
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

         bcrypt.compare(password, data.password, function(err, res) {
            console.log(res);
            if (res) {
               return done(null, data);
            }
            console.log("wrong pass");
            return done(null, false, { message: "inccorect password" });
         });

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