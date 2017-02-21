var request = require("request");
var cheerio = require("cheerio");


// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
    "Grabbing every techcrunch post\n" +
    "\n***********************************\n");


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

        result.push({
            title: title,
            excerpt: excerpt,
            link: link
        });

    });

    console.log(result);
});
