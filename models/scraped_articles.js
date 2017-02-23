var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scrapedArticlesSchema = new Schema({
    title: String,
    excerpt: String,
    link: String,
    photoLink: String,
    comments: [],
    saved: Boolean
});

var scrapedArticles = mongoose.model('scrapedArticles', scrapedArticlesSchema);

module.exports = scrapedArticles;