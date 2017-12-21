"use strict";

const DEBUG = true;

module.exports = function() {

   // add passport 
   const dataBase = require("../models"),
      loginRoute = new require("express").Router();

   // move to html route
   loginRoute.get("/login", function(req, res) {
      DEBUG && console.log("sign in with username/pass");
      res.send(200).send("login"); // res.render();
   });

   loginRoute.post("/newaccount", function(req, res) {
   	console.log(req.body);

   	dataBase.User.create({
   		name: req.body.username,
   		password: req.body.password,
   		alias: req.body.alias || req.body.username,
   		email: req.body.email
   	}).then(() => {
   		res.status(201).send("Registered..please verify your email address");
   	}).catch((err) => {
   		const errorType = err.errors[0].message,
   			errorcode = errorHandler(errorType);

   		switch(errorcode) {
   			case 1:
   				return res.status(409).send("Username taken");
   				break;
   			case 2: 
   				return res.status(406).send("Invalid password format");
   				break;
   			case -1:
   				return res.status(400).send("Bad request");
   				break;
   		}
   	});
   });

   loginRoute.post("/login", function(req, res) {
      console.log(req.body);
      dataBase.User.findOne({
         where: {
            name: req.body.username
         }
      }).then((data) => {
         if (!data) {
            return res.status(404).send("user name doesn't exist");
         }
         if (data.password !== req.body.password) {
            return res.status(401).send("wrong password");
         }
         res.status(200).json("placeholder: send session token");
      });
   });

   return loginRoute;
}

function errorHandler(errtype) {
	console.error(errtype);
	// identify error type using regex to match key word
	if (!!errtype.match(/\w*(?:name)/g)) {
		return 1;
	}

	if (!!errtype.match(/\w*(?:password)/g)) {
		return 2;
	}

	return -1;
}