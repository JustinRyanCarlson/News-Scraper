var express = require("express");
var router = express.Router();

router.get('/', function(req, res) {
    res.render('scrape.handlebars');
});

// Export routes for server.js to use.
module.exports = router;
