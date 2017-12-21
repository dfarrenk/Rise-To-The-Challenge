var express = require("express");
var bodyParser = require("body-parser");
// var methodOverride=require("method-override");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 8080;
var app = express();
var db = require("./models");



app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
require("./controller/challenge-controller.js")(app);
require("./controller/html-controller.js")(app);
require("./controller/user-controller.js")(app);

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
