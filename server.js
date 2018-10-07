
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var exphbs = require("express-handlebars");
var path = require('path');

//default index.js
var db = require("./models");
var PORT = 3000;
var app = express();

// middleware (json parsing)

app.use(logger("dev"));

// body parser for handling submissions

app.use(bodyParser.urlencoded({useNewUrlParser: true}));
app.use(bodyParser.json()); 
app.use(express.static(__dirname + "/public"));

//handlebars

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname , "views"))


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SCRAPPING-DA-WEB";

// Routes
var router = express.Router();


require("./config/routes")(router);

app.use(router);



app.listen(PORT, function () {
    mongoose.connect(MONGODB_URI);

    console.log("App running on port " + PORT);

});