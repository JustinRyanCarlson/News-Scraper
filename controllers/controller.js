var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var randomstring = require("randomstring");
var scrapedArticles = require('./../models/scraped_articles.js');

// GET route for the main page, gets articles from the database and sorts them in ascending age then
// renders scrape.handlebars with them.
router.get('/', function(req, res) {
    scrapedArticles.find().sort('-time').exec(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('scrape.handlebars', { articles: articles });
        }
    });
});

// GET route that queries the database for all the documents that have a saved value of true, sorts them
// in ascending age then renders saved.handlebars with them.
router.get('/saved', function(req, res) {
    scrapedArticles.find({ "saved": true }).sort('-time').exec(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('saved.handlebars', { articles: articles });
        }
    });
});

// GET route that queries the database for a specific document then renders the page using this document
// and its comments.
router.get('/saved/comments/:id', function(req, res) {
    scrapedArticles.find({ "_id": req.params.id }, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments.handlebars', { articles: articles, comments: articles[0].comments });
        }
    });
});

// GET route that scrapes techcrunch.com and adds documents that dont already exist to the database then
// reroutes to "/". I had to use promises in this route since the database queries are asynchronous and would,
// not be finished when the page redirected resulting in not all the articles being rendered when the GET 
// request to "/" was made.
router.get('/scrape', function(req, res) {
    main();

    function main() {

        var promises = [];

        request("https://techcrunch.com/", function(error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape
            var result = [];

            // With cheerio, find each p-tag with the "title" class
            // (i: iterator. element: the current element)
            $("div.block-content").each(function(i, element) {

                // In the currently selected element, look at its child elements (i.e., its a-tags)
                // then save the values for any "href" attributes that the child elements may have
                var title = $(element).children("h2.post-title").text();
                var excerpt = $(element).children("p.excerpt").text().split(" Read");
                var link = $(element).children("h2.post-title").children().attr("href");
                var photoLink = $(element).children("span").children("a").children("img").attr("src");

                var article = {
                    "title": title,
                    "excerpt": excerpt,
                    "link": link,
                    "photoLink": photoLink

                };
                result.push(article);
            });

            for (var i = 0; i < result.length; i++) {
                promises.push(dbFun(result[i]));
            }

            Promise.all(promises).then(function() {
                res.json('send');
            });
        });
    }
});

// PUT route that takes in a document ID then updates its saved property to TRUE.
router.put('/add/article', function(req, res) {
    scrapedArticles.update({ _id: req.body.id }, { $set: { saved: true } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});

// PUT route that akes in a document ID then updates its saved property to FALSE.
router.put('/saved/remove_article', function(req, res) {
    scrapedArticles.update({ _id: req.body.id }, { $set: { saved: false } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});

// PUT route that takes in data for a comment and push that data to a specific documents comments array.
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

// PUT route that takes in the ID of a document and the ID of a comment object within that document and deletes that comment object.
router.put('/saved/delete_comment', function(req, res) {
    scrapedArticles.update({ _id: req.body.articleId }, { $pull: { "comments": { commentId: req.body.commentId } } }, function(err, status) {
        if (err) {
            res.send('fail');
        } else {
            res.send('pass');
        }
    });
});

// Function used in the GET /scrape route that makes a new document in the database if the title of the article is not an empty string and
// if the article doesnt already exist. Resolves the promise no matter what.
function dbFun(article) {
    return new Promise(function(resolve, reject) {
        if (article.title !== "") {
            var newArticle = new scrapedArticles({
                title: article.title,
                excerpt: article.excerpt[0],
                link: article.link,
                photoLink: article.photoLink,
                comments: [],
                saved: false
            });

            scrapedArticles.find({ title: newArticle.title }, function(err, article) {
                if (article.length != 1) {
                    newArticle.save(function(err, article) {
                        if (err) {
                            console.log(err);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }

            });
        } else {
            resolve();
        }

    });

}

// Export routes for server.js to use.
module.exports = router;