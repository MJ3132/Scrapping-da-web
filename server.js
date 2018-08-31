
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require('path');

//default index.js
var db = require("./models");
var PORT = 3000;
var app = express();

// middleware (json parsing)

app.use(logger("dev"));

// body parser for handling submissions

app.use(bodyParser.urlencoded({ useNewUrlParser: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

//handlebars

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"))


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SCRAPPING-DA-WEB";
mongoose.connect(MONGODB_URI);

// Routes

// display homepage 
app.get('/', function (req,res){

    res.render('index');
  })
  



// on click the scrape button we get  all article contents and we render them on the index handlebars

app.get("/scrapedData", function (req, res) {


    axios.get("https://www.vice.com/fr_ca").then(function (err, response, html) {


        var $ = cheerio.load(html);

        $("a.grid__wrapper__card ").each(function (i, element) {

         
        var results = {};

            results.title = $(this).find("h2").text();

            // console.log(results.title)
            results.links = $(this).attr("href");

            // console.log(results.links)

            results.text = $(this).find("div.grid__wrapper__card__text__summary").text();
            // console.log(results.text);

            db.Article.create(results)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })

                .catch(function(err){
                    return res.json(err);
                }); 
         });
  
         // render results into index handlebars
    res.render('index', results)
    })

  

});

app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {
            res.render("index", dbArticle);
        })

});

// populate article with its associated note if its selected
app.get('articles/:id', function (req, res) {

    db.Article.find({ _id: req.params.id })
    populate('note')
        .then((dbArticle) => {
            // send one object (article) to be rendered
            res.render("index", dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// when a note is filled and sent by the user on a particular article
// create that note (model), and update it with its associated article
// return the updated article 
app.put('articles/:id', function (req, res) {

    articleId = req.params.id;

    db.Article.find({ _id: articleId }).then((dbArticle) => {

        res.render('saved', )
    })
});


//save note into article on (the modal, index handlebars)
app.post('articles/:id', function (req, res) {


    db.Note.create(req.body).then((noteInfo) => {
        //note object in the articles model
        return db.Article({ _id: req.params.id }, { $set: { note: noteInfo } });

    })

        .then(function (dbArticle) {

            res.render("saved", dbArticle);
        })

        .catch(function (err) {
            res.json(err);

        });
});



// on clicking save Articles the user should see all his saved articles
app.get('/savedArticles/:id', function (req, res) {

    var savedArticles = [];

    let articleId = req.params.id;

    db.Article.find({ id_: articleId })
    populate('note')
        .then((dbArticle) => {

            savedArticles.push(dbArticle);
            res.render('saved', savedArticles);
        })
        .catch(function (err) {
            res.json(err);
        });
});





app.listen(PORT, function () {

    console.log("App running on port " + PORT);

});