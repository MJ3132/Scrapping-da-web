var axios = require("axios");
var cheerio = require("cheerio");


var scrape = function(cb) {
    
    axios.get("https://www.vice.com/fr_ca").then(function (response) {

        var articles = [];
        var $ = cheerio.load(response.data);


        $("a.grid__wrapper__card ").each(function (i, element) {




            var title = $(this).find("h2").text().trim();

            // console.log(results.title)
            var link = $(this).attr("href").trim();

            // console.log(results.links)

             var text = $(this).find("div.grid__wrapper__card__text__summary").text().trim();
            // console.log(results.text);

            if(title && link && text){

                var dataToAdd = {
                    title: title,
                    text : text,
                    link : link
                }
                articles.push(dataToAdd);
            }
        });

        cb(articles);

      
     
    });
};

module.exports = scrape;
