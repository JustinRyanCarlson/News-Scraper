var express = require('express');
var app = express();
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var PORT = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/TC_scraperDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("MongoDB connected");
});

// Looks at available engines and sets the view engine to Handlebars.
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
app.use(express.static(__dirname + '/public/assets'));
app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));


// Requires the routes from the controller.js file and sets the middleware
// to use these routes.
var routes = require("./controllers/controller.js");
app.use("/", routes);

app.listen(PORT, function() {
    console.log('Listening on port: ' + PORT);
});