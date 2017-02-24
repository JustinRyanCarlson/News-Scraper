$(document.body).on('click', '.delete', function() {
    $(this).addClass('disabled');

    $.ajax({
        url: '/saved/remove_article',
        type: 'PUT',
        data: {
            id: this.id
        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED");
            } else {
                window.location = '/saved';
            }
        }
    });
});