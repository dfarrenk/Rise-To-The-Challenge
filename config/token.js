"use strict";
const DEBUG = true;

const bcrypt = require("bcrypt"),
   Promise = require("bluebird");

const timeout = 60000 * 30;

const tokenMeta = {
   info: "This is the meta object storing all the active accesstoken",
   genToken: function(userData) {
      return new Promise((resolve, reject) => {
         function genTokenkey(userData) {
            return new Promise((resolve, reject) => {
               const welcomeUser = "Welcome friend - " + userData.name;
               bcrypt.hash(welcomeUser, 6, function(err, hash) {
                  console.log("ready to resolve");
                  resolve(hash);
               });
            });
         }

         genTokenkey(userData).then((tokenKey) => {
            const tokenObj = {
               name: tokenKey,
               info: userData,
               timeout: function(meta) {
                  setTimeout(() => {
                     console.log("access token expired");
                     delete meta[this.name];
                  }, timeout);
               }
            }
            resolve(tokenObj);
         });
      })
   }
};

module.exports = tokenMeta;