
var scrape = require("../scripts/scrape");

var headlinesController = require("../controller/headlines");
var notesController = require("../controller/notes");


module.exports = function(router) {
    router.get("/", function(req,res){
        console.log(res)
        res.render("home");
    });



    router.get("/savedArticles", function(req, res){
        res.render("saved");
    });

    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(err, docs){
            if (!docs || docs.insertedCount === 0){
                res.json({
                    message: "No new articles Today. Check back tommorow!"
                });

            } else {
                res.json({
                    message : "Added " + docs.insertedCount + " new articles!"
                });
                console.log(docs);
            }
        });
    });



    router.get("/api/article", function (req, res){
        var query = req.query || {};
        if ( req.query.saved){
            query = req.query;
        }

        headlinesController.get(query, function(data){
            res.json(data);
        });
    });

    router.delete("/api/article/:id", function (req, res){
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function (err,data){
        res.json(data);

        });
    });

    router.put("/api/articles", function (req, res){
        headlinesController.update(req.body, function (err, data){
            res.status(200).json(data);

        });
    });

    router.get("/api/notes/:articles_id", function (req, res){
        var query = {};
        if ( req.params.articles_id) {
            query._id = req.params.articles_id;
        }

            notesController.get(query, function(err, data){
                res.json(data);
            });
        });

        router.delete("/api/notes/:id", function (req,res){
            var query = {};
            query._id = req.params.id;
            notesController.delete(query, function (err, data){
                res.json(data);
            });
        });

        router.post("/api/notes", function (req , res){
            notesController.save(req.body, function(data){
                res.json(data);
            })
        })
    }

