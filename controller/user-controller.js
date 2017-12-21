var db = require("../models");


module.exports = function(app) {
    
    
    /*app.post('/newuser', function(req, res) { // post route to user should be a parent to challenge instance
        var newuser = { //need to know all vars in the model but basic
            user_name: req.body.name,
            user_password:req.body.password,
            user_alias:req.body.alias,
            email: req.body.email
        }
        db.user.create(newuser).then(function(results){ //post a new row in the user table
            res.redirect('/dashboard');
        })
    })*/
    app.get('/user/id/:id', function(req, res){ //when called, returns this users data
        db.user.findAll({
            where:{id:req.params.id} //grab user id
        }).then(function(results){
            res.json(results)
        })
    })
}