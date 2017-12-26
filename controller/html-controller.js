var db = require("../models");
var path = require("path");

module.exports = function(app) {

    app.get('/', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../views/layouts/login.html")) // need to make a "login.handlebars" file to render
        // res.sendFile(path.join(__dirname, "../public/main.html")); // need to make a "login.handlebars" file to render
    })

    app.get('/login', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../views/layouts/login.html")) // need to make a "login.handlebars" file to render
        // res.sendFile(path.join(__dirname, "../public/login.html")); // need to make a "login.handlebars" file to render
    })

    // test route
    app.get("/handlebars", function(req, res) {
        // console.log(handlebarsObject);
        res.render("dashboard" /*, handlebarsObject*/ );
    });
};