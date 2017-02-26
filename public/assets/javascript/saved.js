// OnClick event that when a element that has the class delete is clicked,
// a PUT request is made with the ID, then on success the page is redirected to '/saved'.
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