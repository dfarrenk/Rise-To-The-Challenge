const Moment = require("moment"),
   dataBase = require("../models");

/// not working properly
const setTime = 60000 || Moment(6000).format("X");

// this is the prototype obj design to be inheritted by userdata obj
const Timeout = {
   init: function() {
      this.state = 0;
      this.interval = 0;
   },

   triggerTimeout: function() { /* pass moment parse database timestamp here */
      console.log("1------------1-------------1");
      this.interval = setTimeout(() => {
         dataBase.User.findOne({
            where: {
               id: this.id
            }
         }).then((data) => {
            if (data.email_verified) {
               this.state = 1;
            } else {
            	console.log("deleting.......");
               dataBase.User.destroy({
                  where: {
                     id: this.id
                  }
               }).then(() => {
               	console.log("DELETE!!!!!!!!!!!!!!!!!!!");
                  this.state = -1;
               });
            }
         });
      }, setTime); // timeout atm 1min
   },

   updateState: function() { /*if email_verified before we check (get from cookie)*/
      if (this.email_verified) {
         this.state = 1;
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

// this is the metaObj consist of all the user created since server starts
// will inherit Array.prototype for better iteration and private methods
const TimeoutMeta = {
   activateTimeout: function() {
      this.forEach((elem, index) => {
         if (!elem.state) {
            return !elem.interval && elem.triggerTimeout();
         }
         this.splice(index, 1);
      });
   }
}

// this line is key to successfully run the whole module
// Object.setPrototypeOf(TimeoutMeta, Array);
Object.setPrototypeOf(TimeoutMeta, Array.prototype);

module.exports = function(userData) {
   console.log("-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-");
   // // let userData inherit timeout methods
   Object.setPrototypeOf(userData, Timeout);
   userData.init(); // adding initial property to activate timestamp

   TimeoutMeta.push(userData);
   console.log(TimeoutMeta);

   return TimeoutMeta.activateTimeout();
}