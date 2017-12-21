var express = require("express");
var bodyParser = require("body-parser");
// var methodOverride=require("method-override");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 8080;
var app = express();
var db = require("./models");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));
app.use(function(err, req, res, next) {
   if (err) {
   	console.error(err.stack);
   	return res.status(500).send("Internal server error");	
   }
   next();
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

require("./controller/challenge-controller.js")(app);
require("./controller/html-controller.js")(app);
require("./controller/user-controller.js")(app);

// for testing
app.get("/login", require("./controller/loginRoute.js")());
app.post("/login", require("./controller/loginRoute.js")());
app.post("/newaccount", require("./controller/loginRoute.js")());

db.sequelize.sync({ force: true }).then(function() {
  	// temp for testing only
   db.User.create({
      name: "71emj",
      password: "!wtuce40B65",
      alias: "71emj",
      email: "tim.jeng@gmail.com"
   }).catch((err) => {
   	console.log(err);
   });

   app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
   });
});	