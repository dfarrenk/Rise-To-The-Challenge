var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var Exsess = require("express-session");
var CookieParser = require("cookie-parser");
var flash = require("connect-flash");

var PORT = process.env.PORT || 8080;
var app = express();
var db = require("./models");
var passport = require("./config/local.js");
var errorHandler = require("./errorhandler/handler.js");

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Allows comparisons in handlebars
var Handlebars = require('handlebars');
Handlebars.registerHelper('if_eq', function(a, b, opts) {
   if (a == b) {
      return opts.fn(this);
   }
   else {
      return opts.inverse(this);
   }
});

app.use(express.static("public"));
app.use(CookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Exsess({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(flash());
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

// app.get("/*/*", function(req, res, next) {
//    console.log("get...%s", req.path);
//    if (req.path.match(/\account|\email|\logout/)) {
//       console.log("I should return here");
//       return next();
//    }

//    if (!req.user) {
//       console.log(req.user);
//       return res.status(401).send("Please login");
//    }
//    next();
// });

require("./controller/challenge-controller.js")(app);
require("./controller/html-controller.js")(app);
require("./controller/user-controller.js")(app);

app.get("/login/*?", require("./controller/login-controller.js")());
app.post("/login/*?", require("./controller/login-controller.js")());
app.post("/login", require("./controller/login-controller.js")());


db.sequelize.sync({ force: false }).then(function() {

   app.listen(PORT, function() {
      console.log(passport);
      console.log("App listening on PORT " + PORT);
   });
});
