var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var randomstring = require("randomstring");
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

router.get('/saved/comments/:id', function(req, res) {
    scrapedArticles.find({ "_id": req.params.id }, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments.handlebars', { articles: articles, comments: articles[0].comments });
        }
    });
});

router.get('/scrape', function(req, res) {
    main();

    function main() {

        var promises = [];

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

                for (var j = 0; j < i; j++) {
                    promises.push(dbFun());
                }

                function dbFun() {
                    return new Promise(function(resolve, reject) {
                        var randomTimeout = Math.floor(Math.random() * 5000) + 1;

                        // Using setTimeout to "simulate" an async process such as a db query
                        setTimeout(function() {

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
                                            } else {
                                                resolve(value);
                                            }
                                        });
                                    }

                                });
                            }
                        }, randomTimeout);
                    });

                }
            });
        });
    }
});

router.put('/add/article', function(req, res) {
    scrapedArticles.update({ _id: req.body.id }, { $set: { saved: true } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});

router.put('/saved/remove_article', function(req, res) {
    scrapedArticles.update({ _id: req.body.id }, { $set: { saved: false } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});

router.put('/saved/post_comment', function(req, res) {
    var comment = {
        "articleId": req.body.id,
        "commentId": randomstring.generate(),
        "author": req.body.author,
        "comment": req.body.comment
    };
    scrapedArticles.update({ _id: req.body.id }, { $push: { comments: comment } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});








router.put('/saved/delete_comment', function(req, res) {
    console.log(req.body);
    scrapedArticles.update({ _id: req.body.articleId }, { $pull: { "comments": { commentId: req.body.commentId } } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});

// Export routes for server.js to use.
module.exports = router;