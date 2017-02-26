// OnClick event that when a element that has the class post-comment is clicked,
// a PUT request is made with the author, ID, and comment data.
$(document.body).on('click', '.post-comment', function() {
    $(this).addClass('disabled');
    var author = $('#author').val().trim();
    var comment = $('#comment').val();

    $.ajax({
        url: '/saved/post_comment',
        type: 'PUT',
        data: {
            id: this.id,
            author: author,
            comment: comment
        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED");
            } else {
                location.reload();
            }
        }
    });
});

// OnClick event that when a element that has the class glyphicon-remove is clicked,
// a PUT request is made with the comment ID, and article ID.
$(document.body).on('click', '.glyphicon-remove', function() {
    $(this).addClass('disabled');
    var articleId = $(this).attr("data-articleId");

    $.ajax({
        url: '/saved/delete_comment',
        type: 'PUT',
        data: {
            commentId: this.id,
            articleId: articleId

        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED");
            } else {
                location.reload();
            }
        }
    });
});