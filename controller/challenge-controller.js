var db = require("../models");


module.exports = function(app) {
    
    app.post('/challenge/new', function(req, res) {// post route for a new challenge, also a parent to challenge instance
        var newChallenge={ //grab request body info to create new challenge object
            id: req.body.id,
            challenge_name: req.body.name,
            challenge_rule: req.body.rule
        }
        db.challenge.create(newChallenge).then(function(results){ //post a new row in the challenge table
            res.redirect('/home');
        })
    })
    
    app.post('/challenge/instance/new', function(req,res){ //post route for a challenge instance , child of user and challenge
        var newChallengeInstance ={ // need to know all vars required (what doesn't have a default value in model)
            challengeID: req.body.challenge,
            issuerName:req.body.issuer,
            accepterName:req.body.accepter
            //startState should be default defined boolean
            //gameState should be default value defined boolean
        }
        db.challenge_instance.create(newChallengeInstance).then(function(results){ //post a new row in the challenge_instance table
            res.redirect('/home');
        })
    })
    
    app.put('/challenge/instance/accept', function(req,res){ //update the instance startState to true (user accepted challenge)
        db.challenge_instance.update({
            startState:true
            },{
                where:{id:req.body.id} //grab challenge id from req
            }).then(function(results){
                res.redirect('/home');
            })
    })
    
    app.put('/challenge/instance/reject', function(req,res){ //update the instance startState to false (user rejected challenge)
        db.challenge_instance.update({
            startState:false
            },{
                where:{id:req.body.id} //grab challenge id from req
            }).then(function(results){
                res.redirect('/home');
            })
    })
    
    app.put('/challenge/instance/prove', function(req,res){//update the instance gameState to true (user added proof)
        db.challenge_instance.update({
            gameState:true
            },{
                where:{id:req.body.id} //grab challenge id from req.
            }).then(function(results){
                res.redirect('/home');
            })
    })
    
    app.put('/challenge/instance/proofreject', function(req,res){//update the instance gameState to false (user proof rejected!)
        db.challenge_instance.update({
            gameState:false
            },{
                where:{id:req.body.id} //grab challenge id from req.
            }).then(function(results){
                res.redirect('/home');
            })
    })
    
    
    //use this while we keep the instance
    /*app.put('/challenge/instance/reject', function(req,res){//update the instance complete to true (user proof accepted!)
        db.challenge_instance.update({
            completeState:true
            },{
                where:{id:req.body.id} //grab challenge id from req.
            }).then(function(results){
                res.redirect('/home');
            })
    })*/
    
    // for when we want to get rid of instance
    /*app.delete('/challenge/instance/finish', function(req,res){
        db.challenge_instance.destroy({
            {where:{id:req.body.id}} //grab challenge id to be destroyed
        }).then(function(results){
            res.json(results);
        })
    })*/
    
    
}
