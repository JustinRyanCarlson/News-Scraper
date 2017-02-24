var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var scrapedArticles = require('./../models/scraped_articles.js');

router.get('/', function(req, res) {
    scrapedArticles.find().sort('-time').exec(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('scrape.handlebars', { articles: articles });
        }
    });
});

router.get('/saved', function(req, res) {
    scrapedArticles.find({ "saved": true }).sort('-time').exec(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('saved.handlebars', { articles: articles });
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
        // var result = [];

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("div.block-content").each(function(i, element) {

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            var title = $(element).children("h2.post-title").text();
            var excerpt = $(element).children("p.excerpt").text().split(" Read");
            var link = $(element).children("h2.post-title").children().attr("href");
            var photoLink = $(element).children("span").children("a").children("img").attr("src");


            if (title !== "") {
                var newArticle = new scrapedArticles({
                    title: title,
                    excerpt: excerpt[0],
                    link: link,
                    photoLink: photoLink,
                    comments: [],
                    saved: false
                });

                scrapedArticles.find({ title: newArticle.title }, function(err, article) {
                    if (article.length != 1) {
                        newArticle.save(function(err, article) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }

                });
            }
        });
    });
});

router.put('/save', function(req, res) {
    scrapedArticles.update({ _id: req.body.id }, { $set: { saved: true } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});


// Export routes for server.js to use.
module.exports = router;