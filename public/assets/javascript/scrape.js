$(document.body).on('click', '.scrape-btn', function() {
    $('.scrape-btn').addClass('disabled');

    $.get('/scrape', function(response) {
        console.log('clicked scraper');
    });
});




$(document.body).on('click', '.save', function() {
    $(this).addClass("disabled");

    $.ajax({
        url: '/save',
        type: 'PUT',
        data: {
            id: this.id
        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED")
            }
        }
    });
});