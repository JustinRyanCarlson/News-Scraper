var express = require("express");
var router = express.Router();
var scraper = require("./../public/assets/javascript/scraper.js");
var scrapedArticles = require('./../models/scraped_articles.js');

router.get('/', function(req, res) {
    res.render('scrape.handlebars');
});

router.post('/scrape', function(req, res) {

});

// Export routes for server.js to use.
module.exports = router;
