var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var scrapedArticles = require('./../models/scraped_articles.js');

router.get('/', function(req, res) {
    scrapedArticles.find(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('scrape.handlebars', { articles: articles });
        }
    });
});

router.get('/scrape', function(req, res) {
    // Making a request call for reddit's "webdev" board. The page's HTML is saved as the callback's third argument
    request("https://techcrunch.com/", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        var result = [];

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("div.block-content").each(function(i, element) {

            // Save the text of the element (this) in a "title" variable
            // var title = $(this).text();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            var title = $(element).children("h2.post-title").text();
            var excerpt = $(element).children("p.excerpt").text();
            var link = $(element).children("h2.post-title").children().attr("href");
            var photoLink = $(element).children().children().children().attr("src");

            // result.push({
            //     title: title,
            //     excerpt: excerpt,
            //     link: link,
            //     photoLink: photoLink
            // });

            var newArticle = new scrapedArticles({
                title: title,
                excerpt: excerpt,
                link: link,
                photoLink: photoLink,
                comments: [],
                saved: false
            });

            newArticle.save(function(err, article) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(article);
                    }
                })
                // scrapedArticles.find({ title: result[i].title }, function(err, article) {
                //     if (!article.length) {
                //         scrapedArticles.save
                //     }
                // });


        });

        console.log(result);
    });
});

// Export routes for server.js to use.
module.exports = router;