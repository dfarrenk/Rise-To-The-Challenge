// This module is an experiment on catching and logging unhandle errors
module.exports = function() {
	// setup dependencies
   const FS = require("fs");

   return process
      .on("unhandledRejection", (reason, p) => {
         console.error(err.code);
         console.error(reason, 'Unhandled Rejection at Promise', p);
      })
      .on("uncaughtException", (err) => {
         console.error(err.code);
         console.error(err, "Uncaught Exception thrown");
         process.exit(1);
      });
}