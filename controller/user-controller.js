var db = require("../models"),
   handlebars = require("handlebars"),
   path = require("path");

const isVerified = function(req, res, next) {
   if (!req.user.email_verified) {
      return res.status(401).cookie("verified", false).redirect("/user/dashboard");
   }
   next();
}

module.exports = function(app) {

   app.get("/user/*?", function(req, res, next) {
      if (req.path.match(/\logout/)) {
         console.log("I should return here");
         return next();
      }

      if (!req.user) {
         console.log(req.user);
         return res.status(401).sendFile(path.join(__dirname, "../public/plsLogin.html"));
      }

      next();
   });

   app.get("/user/logout", function(req, res) {
      console.log("heeeer");
      !req.cookies["connect.sid"] ? res.status(200).send("/login") :
         res.status(200).clearCookie("connect.sid").send("/login");
   });

   // test route
   app.get("/user/dashboard", function(req, res) {
      req.user.email_verified && res.clearCookie("verified");
      
      var handlebarsObject;
      db.User.findAll({
         where: { id: req.user.id }, //grab user id
         include: [{
            model: db.Instance,
            as: "issued",
            include: [{
               model: db.Template
            }, {
               model: db.User,
               as: "accepted"
            }]
         }, {
            model: db.Instance,
            as: "accepted",
            include: [{
               model: db.Template
            }, {
               model: db.User,
               as: "issued"
            }]
         }]
      }).then(function(results) {
         handlebarsObject = results[0];
         // res.json(handlebarsObject);
         res.render("dashboard", handlebarsObject);
      });
   });

   app.get('/user/createChallenge', isVerified, function(req, res) { //load the create new challenge page

      handlebars.registerHelper("json", function(obj) {
         console.log("Helper is running ", obj);
         return new handlebars.SafeString(JSON.stringify(obj));
      });

      const template = new Array(),
         user = new Array();

      db.User.findAll().then((user_data) => {
         db.Template.findAll().then((template_data) => {

            template_data.forEach((elem) => {
               template.push({
                  name: elem.name,
                  rule: elem.rule,
                  id: elem.id
               })
            });

            user_data.forEach((elem) => {
               user.push({
                  name: elem.name,
                  email: elem.email,
                  id: elem.id
               });
            });

            res.render("sendChallenge", { template: template, user: user });
         });
      });
   }); // challenge form now a modal

   app.get('/user/arChallenge', isVerified, function(req, res) { //go to accept/reject a newly issued challenge page.
      console.log(req.originalUrl);

      db.Instance.findOne({
         where: {
            challenge_id: req.query["instance"]
         },
         include: [db.Template]
      }).then(function(data) {
         const renderObj = data;
         renderObj.state === "challenge-accepted" ? renderObj.dataValues.state_code = 1 :
            renderObj.dataValues.state_code = 0;

         res.status(200).render("challenge", renderObj);
      });
   });

   app.get('/user/revProof', isVerified, function(req, res) { //go to review proof page
      console.log(req.query["instance"]);
      db.Instance.findOne({
         where: {
            challenge_id: req.query["instance"]
         },
         include: [db.Template]
      }).then((data) => {

         res.status(200).render("revProof", data);
         // res.sendFile(path.join(__dirname, "../views/layouts/revProof.html"));
      });
   });

   // app.get('/user/subProof/:instanceId', function(req, res) { // go to user proof submission page
   //    res.sendFile(path.join(__dirname, "../public/subProof.html")); //
   // });

   app.get('/user/proveChallenge', function(req, res) { //load the prove challenge page on selected challenge instance, need to find the challenge instance
      /* db.challengeInstance.findAll({
           where:{id:req.body.id} //grab challenge id
       }).then(function(results){
           var hbsObject = {key:results.dataValues}
           res.render('proveChallenge',hbsObject)
       })*/
   });

   // app.get('/user/dashboard', function(req, res) { //get data from  our tables to populate home page
   //    // testing for response
   //    // res.status(200).json({
   //    //    user: req.user.name,
   //    //    userid: req.user.id,
   //    //    email: req.user.email
   //    // });

   //    //res.status(200).sendFile(path.join(__dirname, "../views/layouts/dashboard.html"));
   //    db.Instance.findAll({
   //       where: { issuer_id: req.user.dataValues.id },
   //       include: [db.Template]
   //    }).then(function(results) {
   //       var challengesIssued = results;
   //       challengesIssued.map(v => v.challengedIssued = true); //assign value to each of challengedIssued==true
   //       for (var i = 0; i < challengesIssued.length; i++) { //loop through results, assign correct truthy value and change any old ones for Hbars to grab onto.
   //          console.log(challengesIssued[i]);
   //          if (challengesIssued[i].dataValues.state === "challenge-issued") {
   //             console.log("this challenge is in the challenge issued state"); //create a truthy value for handlebars logic
   //             challengesIssued[i]['challenge-issued'] = true;
   //          } else if (challengesIssued[i].dataValues.state === "challenge-accepted") { // change truthy and use different variable
   //             challengesIssued[i]['challenge-issued'] = false;
   //             challengesIssued[i]['challenge-accepted'] = true;
   //          } else if (challengesIssued[i].dataValues.state === 'provided-proof') { //change and add truthy
   //             challengesIssued[i]['challenge-issued'] = false;
   //             challengesIssued[i]['challenge-accepted'] = false;
   //             challengesIssued[i]['provide-proof'] = true;
   //          }
   //       }
   //       db.Instance.findAll({
   //          where: { accepter_id: req.user.dataValues.id },
   //          include: [db.Template]
   //       }).then(function(results2) {
   //          var challengesRecieved = results2;
   //          challengesRecieved.map(y => y.challengedIssued = false); //assign value to each of challengeIssued = false.
   //          var allChallenges = challengesIssued.concat(challengesRecieved);
   //          var hbsObject = { key: allChallenges };
   //          //.log(hbsObject);
   //          //console.log(hbsObject.key[0].dataValues)
   //          //console.log(hbsObject.key[0].dataValues.Template.dataValues.name)
   //          res.render('dashboard', hbsObject);
   //       });
   //       //fill in logic here to create our hbsObject needs to populate user challenges, sent and recieved, sample

   //    });
   // });


   // app.get('/user/id/:id', function(req, res) { //when called, returns this users data
   //    db.user.findAll({
   //       where: { id: req.params.id } //grab user id
   //    }).then(function(results) {
   //       res.json(results);
   //    });
   // });

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
};
