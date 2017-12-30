var db = require("../models");
var path = require("path");

module.exports = function(app) {

    app.get('/', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../views/layouts/login.html")); // need to make a "login.handlebars" file to render
        // res.sendFile(path.join(__dirname, "../public/main.html")); // need to make a "login.handlebars" file to render
    });

    app.get('/login', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../views/layouts/login.html")); // need to make a "login.handlebars" file to render
        // res.sendFile(path.join(__dirname, "../public/login.html")); // need to make a "login.handlebars" file to render
    });

    // test route
    app.get("/user/dashboard", function(req, res) {
        var handlebarsObject;
        db.User.findAll({
            where: { id: req.user.id }, //grab user id
            include: [{
                model: db.Instance,
                as: "issued",
                include: [{
                    model: db.Template
                }]
            }, {
                model: db.Instance,
                as: "accepted",
                include: [{
                    model: db.Template
                }]
            }]
        }).then(function(results) {
            handlebarsObject = results[0];
            // res.json(handlebarsObject);
            // console.log(handlebarsObject);
            res.render("dashboard", handlebarsObject);
        });
    });
};
