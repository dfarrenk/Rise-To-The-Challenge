"use strict";
const DEBUG = true;

module.exports = function() {

	// add passport 
	const dataBase = require("../models");
		loginRoute = require("express").Router();


	loginRoute.get("/login", function(req, res) {
		console.log("sign in with username/pass");
		res.send(200).send("login");
	});

	loginRoute.post("/login", function(req, res) {
		

		
	});



	return loginRoute;
}