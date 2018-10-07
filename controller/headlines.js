// bring in the scrape script
const scrape = require("../scripts/scrape");
const makeDate = require("../scripts/date");
// bring in the model for the article
const Article = require("../models/article");


module.exports = {
  // fetch will run scrape and insert into db roomrave collection article
  fetch: function (cb) {
    scrape(function (data) {
      var articles = data;
      // console.log("this is my articles in my controller> article.js\n", articles);
      // loop over each and give a datae and set saved to false
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      // mongo function to insert alot of data.
      Article.collection.insertMany(articles, {
        ordered: false
      }, function (err, docs) {
        cb(err, docs); // if something fails, it will skip over the failed insert and continue.
      })
    })
  },
  delete: function (query, cb) {
    // will remote whatever is quired
    Article.remove(query, cb)
  },
  get: function (query, cb) {
    // find all the port in the query
    // sort more recent to lest recent
    // pass them to the callback
    // console.log(`This is the article get method for query: ${query}`)
    Article.find(query)
      .sort({
        _id: -1
      })
      .exec(function (err, doc) {
        if (err) throw ('Error in the article controler GET',err);
        cb(doc)
      })
  },
  update: function (query, cb) {
    // console.log("this method for update with query at id:", query);
    // update new post scraped with the id
    // update any id passed to the post with tat data
    // aug 27 changed update to updateOne
    console.log("this is the article controler UPDATE query", query);
    Article.updateOne({_id: query._id}, {
      $set: {saved: query.saved} }, {}, cb);
  }
}