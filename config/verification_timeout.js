"use strict";
const DEBUG = true;

const dataBase = require("../models");
const setTime = 60000; // set to 1 hour for demo, 12 hours in production

// this is the prototype obj design to be inheritted by userdata obj
const Timeout = {
   init: function() {
      this.state = 0;
      this.interval = 0;
   },

   triggerTimeout: function() { /* pass moment parse database timestamp here */
      DEBUG && console.log("1------------1-------------1");
      this.interval = setTimeout(() => {
         dataBase.User.findOne({
            where: {
               id: this.id
            }
         }).then((data) => {
         	// this block is here to prevent process hang when do data returns
         	if (!data) {
         		this.state = -1;
         		return console.log("It seems like we don't have to continue after all");
         	}

            if (data.email_verified) {
               DEBUG && console.log("hew made it in time");
               this.state = 1;
            } else {
               DEBUG && console.log("deleting.......");
               dataBase.User.destroy({
                  where: {
                     id: this.id
                  }
               }).then(() => {
                  DEBUG && console.log("DELETE!!!!!!!!!!!!!!!!!!!");
                  this.state = -1;
               });
            }
         });
      }, setTime); // timeout atm 1min
   },

   updateState: function() { /*if email_verified before we check (get from cookie)*/
      if (this.email_verified) {
         this.state = 1;
         DEBUG && console.log("cooooooooooooooooooool");
         clearTimeout(this.interval);
      }
   } // currently unaccessable
}

// state === 0 || 1 || -1
// !state && ineterval == null --> this.triggerTimeout() ||
// !state && ineterval == notnull --> continue ||

// // if state (not false)
// state > 0 --> metaobj.splice(this.index, 1) ||
// state < 0 --> metaobj.splice(this.index, 1)

const TimeoutMeta = {
   activateTimeout: function() {
      DEBUG && console.log("We are starting");
      this.forEach((elem, index) => {
         elem.updateState();
         if (!elem.state) {
            !elem.interval && elem.triggerTimeout();
         } else {
            this.splice(index, 1);
            DEBUG && console.log(this);
         }
      });
   }
}

Object.setPrototypeOf(TimeoutMeta, Array.prototype);

module.exports = function(userData) {
   DEBUG && console.log("-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-");

   Object.setPrototypeOf(userData, Timeout);
   userData.init(); // adding initial property to activate timestamp

   TimeoutMeta.push(userData);
   DEBUG && console.log(TimeoutMeta);

   return TimeoutMeta;
}


// if for some reason the user is deleted from the database not by the module
// the process will hang because the server doesn't know what to do when it can't find 
// the data it is looking for