var db = require("../models"),
    path = require("path");

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

   app.get('/user/id/:id', function(req, res) { //when called, returns this users data
      db.user.findAll({
         where: { id: req.params.id } //grab user id
      }).then(function(results) {
         res.json(results)
      })
   });

   app.get('/user/revProof/:instanceId', function(req, res) { //go to review proof page
      res.sendFile(path.join(__dirname, "../public/revProof.html")) 
   });

   app.get('/user/subProof/:instanceId', function(req, res) { // go to user proof submission page
      res.sendFile(path.join(__dirname, "../public/subProof.html")) // 
   });

   app.get('/user/arChallenge/:instanceId', function(req, res) { //go to accept/reject a newly issued challenge page.
      // res.sendFile(path.join(__dirname, "../public/challenge.html")) // 
      res.sendFile(path.join(__dirname, "../views/layouts/challenge.html"));
   });

   app.get('/user/dashboard', function(req, res) { //get data from  our tables to populate home page
      // testing for response
      // res.status(200).json({
      //    user: req.user.name,
      //    userid: req.user.id,
      //    email: req.user.email
      // });
      console.log("_______________");
      console.log(req);
      res.status(200).sendFile(path.join(__dirname, "../views/layouts/dashboard.html"));
      // db.user.findAll({
      //    where:{id:req.}
      //    include: [challengeInstance];
      // }).then(function(results) {
      //    //fill in logic here to create our hbsObject needs to populate user challenges, sent and recieved, sample
      //    var hbsObject = { key: results.dataValues }
      //    res.render('dashboard', hbsObject)
      // });
   });

   app.get('/user/createChallenge.html', function(req,res){ //load the create new challenge page
        res.status(200).sendFile(path.join(__dirname, "../views/layouts/sendChallenge.html"));
       // res.render('newChallenge'); // need to make a "newChallenge.handlebars" file to render
   })// challenge form now a modal

   app.get('/user/proveChallenge', function(req, res) { //load the prove challenge page on selected challenge instance, need to find the challenge instance
      /* db.challengeInstance.findAll({
           where:{id:req.body.id} //grab challenge id
       }).then(function(results){
           var hbsObject = {key:results.dataValues}
           res.render('proveChallenge',hbsObject)
       })*/
   })
}