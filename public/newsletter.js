

// grab all the articles as json
$("#scrape-button").on("click", function () {
    $.get("/articles");
});



//save Article, so the article can be inserted into the saved articles page

$("#save-button").on("click", function () {

    let articleId = $(this).attr('data-id');

    $.post(`savedArticles/${articleId}`, function () {

    });
});



// Open  modal when clicking the open modal button, (saving and closing methods inside of it)

$('#open-modal').on('click', function () {

// open modal
 $('#note-modal').modal('toggle');

 // create Note and associate it with the article

    $('#note-create').on('click', function(){

        let articleId = $(this).attr('data-id');

        // text area note info

        let noteInfo = $('note-content').val().trim();

        $.post(`/articles/${articleId}`,noteInfo);

        // empty modal text area
        $('#note-content').empty();
        
    });
});




