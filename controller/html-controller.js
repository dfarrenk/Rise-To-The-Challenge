var db = require("../models");
var path = require("path");

module.exports = function(app) {
    app.get('/', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../public/main.html")) // need to make a "login.handlebars" file to render
    })

    app.get('/login', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../public/login.html")) // need to make a "login.handlebars" file to render
    })
    app.get('/revProof', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../public/revProof.html")) // need to make a "login.handlebars" file to render
    })
    app.get('/subProof', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../public/subProof.html")) // need to make a "login.handlebars" file to render
    })
    app.get('/arChallenge', function(req, res) { //go to login page
        res.sendFile(path.join(__dirname, "../public/challenge.html")) // need to make a "login.handlebars" file to render
    })

    app.get('/dashboard', function(req, res) { //get data from  our tables to populate home page
        /*db.user.findAll({
            include: [challengeInstance];
        }).then(function(results){
            //fill in logic here to create our hbsObject needs to populate user challenges, sent and recieved, sample
            var hbsObject = {key:results.dataValues}
            res.render('dashboard', hbsObject)

        })*/
    })

    /*app.get('/newChallenge', function(req,res){ //load the create new challenge page
        res.render('newChallenge'); // need to make a "newChallenge.handlebars" file to render
    })// challenge form now a modal*/

    app.get('/proveChallenge', function(req, res) { //load the prove challenge page on selected challenge instance, need to find the challenge instance
        /* db.challengeInstance.findAll({
             where:{id:req.body.id} //grab challenge id
         }).then(function(results){
             var hbsObject = {key:results.dataValues}
             res.render('proveChallenge',hbsObject)
         })*/
    })
}
