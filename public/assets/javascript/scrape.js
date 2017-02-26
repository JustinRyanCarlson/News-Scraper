// OnClick event that when a element that has the class scrape-btn is clicked,
// a GET request is made to '/scrape'. When the response comes back, the 
// page is redirected to '/'.
$(document.body).on('click', '.scrape-btn', function() {
    $('.scrape-btn').addClass('disabled');

    $.get('/scrape', function(status) {
        if (status === 'send') {
            window.location.href = '/';
        }
    });
});

// OnClick event that when a element that has the class save is clicked,
// a PUT request is made to '/add/article' with the ID data.
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