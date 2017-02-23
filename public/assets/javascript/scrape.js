$(document.body).on('click', '.scrape-btn', function() {
    console.log('scraper')
    $.get('/scrape', function(response) {
        console.log('clicked scraper');
    });
});




$(document.body).on('click', '.save', function() {
    $.ajax({
        url: '/save',
        type: 'PUT',
        data: {
            id: this.id
        },
        success: function(response) {
            console.log(response);

            if (response === "pass") {
                // open modal
            } else {
                // open modal
            }
        }
    });
});