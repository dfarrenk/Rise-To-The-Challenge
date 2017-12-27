const Moment = require("moment"),
   dataBase = require("../models");

/// not working properly
const setTime = 6000 || Moment(6000).format("X");

// this is the prototype obj design to be inheritted by userdata obj
const Timeout = {
   init: function() {
      this.state = 0;
      this.interval = 0;
   },

   triggerTimeout: function(initTime) { /* pass moment parse database timestamp here */
      console.log("1------------1-------------1");
      console.log(this);
      console.log(Object.keys(this));
      this.interval = setTimeout(() => {
         console.log("deleting.......");
         dataBase.User.findOne({
            where: {
               id: this.id
            }
         }).then((data) => {
            if (data.email_verified) {
               this.state = 1;
               // this.interval = 0;
            } else {
               dataBase.User.destroy({
                  where: {
                     id: this.id
                  }
               }).then(() => {
               	console.log("DELETE!!!!!!!!!!!!!!!!!!!");
                  this.state = -1;
               })
            }
         });
      }, initTime + setTime); // timeout 
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
         const initTime = Moment(elem.createdAt).utc().format("X");
         if (!elem.state) {
            return !elem.interval && elem.triggerTimeout(6000);
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
   TimeoutMeta.activateTimeout();
}

// const unix = Moment("2017-12-27T03:03:05.000Z").utc().format("X");
// console.log(unix);
// const milliseconds = Moment("24:00:00", "HH A").format("X");
// console.log(Moment.unix(unix));
// console.log(Moment().milliseconds());