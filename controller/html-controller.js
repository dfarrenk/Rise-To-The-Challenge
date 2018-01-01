var db = require("../models");
var path = require("path");

module.exports = function(app) {
   app.get('/', function(req, res) { //go to login page
      // res.sendFile(path.join(__dirname, "../views/layouts/login.html")); // need to make a "login.handlebars" file to render
      res.status(200).render("login");
   });

   app.get('/login', function(req, res) { //go to login page
      res.status(200).render("login");
   });
};