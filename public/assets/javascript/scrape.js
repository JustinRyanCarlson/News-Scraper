$(document.body).on('click', '.scrape-btn', function() {
    $('.scrape-btn').addClass('disabled');

    $.get('/scrape');
});




$(document.body).on('click', '.save', function() {
    $(this).addClass("disabled");

    $.ajax({
        url: '/add/article',
        type: 'PUT',
        data: {
            id: this.id
        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED");
            }
        }
    });
});