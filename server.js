var express = require("express");
var bodyParser = require("body-parser");
// var methodOverride=require("method-override");
var exphbs = require("express-handlebars");
var Exsess = require("express-session");
var CookieParser = require("cookie-parser")

var PORT = process.env.PORT || 8080;
var app = express();
var db = require("./models");
var passport = require("./config/local.js");
var errorHandler = require("./errorhandler/handler.js");

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));
app.use(CookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Exsess({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(function(err, req, res, next) {
   if (err) {
      console.error(err.stack);
      return errorHandler(err);
   }
   next();
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// check for login session
app.get("/*/*", function(req, res, next) {
   console.log(req.path);
   if (req.path.match(/(?:account)||(?:email)/)) {
   // if (req.path === "/login" || req.path === "/" || req.path === "/newaccount" || req.path === "/emailverification") {
      console.log("I should return here");
      return next();
   }

   if (!req.user) {
      console.log(req.user);
      return res.status(401).send("Please login");
   }
   next();
});

require("./controller/challenge-controller.js")(app);
require("./controller/html-controller.js")(app);
require("./controller/user-controller.js")(app);

app.get("/login/*?", require("./controller/login-controller.js")());
app.post("/login/*?", require("./controller/login-controller.js")());
app.post("/login", require("./controller/login-controller.js")());

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

      console.log(passport);
      console.log("App listening on PORT " + PORT);
   });
});