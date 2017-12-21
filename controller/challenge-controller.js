var db = require("../models");


module.exports = function(app) {

    app.post('/challenge/new', function(req, res) { // post route for a new challenge, also a parent to challenge instance
        var newChallenge = { //grab request body info to create new challenge object
            id: req.body.id,
            challenge_name: req.body.name,
            challenge_rule: req.body.rule
        };
        db.Challenge.create(newChallenge).then(function(results) { //post a new row in the challenge table
            res.redirect('/home');
        });
    });

    app.post('/challenge/instance/new', function(req, res) { //post route for a challenge instance , child of user and challenge
        var newChallengeInstance = { // need to know all vars required (what doesn't have a default value in model)
            challengeID: req.body.challenge,
            issuerName: req.body.issuer,
            accepterName: req.body.accepter
            //startState should be default defined boolean
            //gameState should be default value defined boolean
        };
        db.Instance.create(newChallengeInstance).then(function(results) { //post a new row in the Instance table
            res.redirect('/home');
        });
    });

    app.put('/challenge/instance/accept', function(req, res) { //update the instance state to true (user accepted challenge)
        db.Instance.update({
            state: 'challenge-accepted'
        }, {
            where: { id: req.body.id } //grab challenge id from req
        }).then(function(results) {
            res.redirect('/home');
        });
    });

    app.put('/challenge/instance/reject', function(req, res) { //update the instance startState to false (user rejected challenge)
        db.Instance.update({
            state: 'challenge-rejected'
        }, {
            where: { id: req.body.id } //grab challenge id from req
        }).then(function(results) {
            res.redirect('/home');
        });
    });

    app.put('/challenge/instance/prove', function(req, res) { //update the instance gameState to true (user added proof)
        db.Instance.update({
            state: "provided-proof"
        }, {
            where: { id: req.body.id } //grab challenge id from req.
        }).then(function(results) {
            res.redirect('/home');
        });
    });

    app.put('/challenge/instance/proofreject', function(req, res) { //update the instance gameState to false (user proof rejected!)
        db.Instance.update({
            state: "proof-rejected"
        }, {
            where: { id: req.body.id } //grab challenge id from req.
        }).then(function(results) {
            res.redirect('/home');
        });
    });


    //use this while we keep the instance
    /*app.put('/challenge/instance/reject', function(req,res){//update the instance complete to true (user proof accepted!)
        db.Instance.update({
            completeState:true
            },{
                where:{id:req.body.id} //grab challenge id from req.
            }).then(function(results){
                res.redirect('/home');
            })
    })*/

    // for when we want to get rid of instance
    /*app.delete('/challenge/instance/finish', function(req,res){
        db.Instance.destroy({
            {where:{id:req.body.id}} //grab challenge id to be destroyed
        }).then(function(results){
            res.json(results);
        })
    })*/


};
