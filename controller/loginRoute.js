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
		dataBase.User.findOne({
			where: {
				name: req.body.username
			}
		}).then((data) => {
			if (!data) {
				return res.status(404).send("user name not exist");
			}
			if (data.password !== req.body.password) {
				return res.status(401).send("wrong password");
			}
			res.status(200).json("placeholder: send session token");
		});
	});

	return loginRoute;
}