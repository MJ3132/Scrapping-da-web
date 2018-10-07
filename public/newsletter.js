

$(document).ready(function (){

    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    
initPage();

function initPage(){

    articleContainer.empty();
    $.get("/api/article")
        .then(function(data){
            if (data && data.length){
                renderArticles(data);
            } 
            else {
                renderEmpty();
            }
        });

}


function renderArticles(articles){

    var articlePanels = [];

    for (var i = 0; i < articles.length; i++){
        articlePanels.push(createPanel(articles[i]));
    }

    articleContainer.append(articlePanels);
}


function createPanel(article){
    var panel = 

    $(["<div class='panel panel-default'>",
    "<div class='panel-heading'>",
    "</h3>",
    article.title,
    "<a class='btn btn-success save'>",
    "Save Article", 
    "</a>", 
    "</h3>",
    "</div>",
    "<div class='panel-body'>",
    article.text,
    "</div>",
    "</div>"
    ].join(""));

// this is for figuring out what Article the User wants to save
    panel.data("_id", article._id);

    return panel;
}



function renderEmpty (){

var emptyAlert =

$(["<div class='alert alert-warning text-center'>",
"<h4> uh oh. looks like we dont have any new articles.</h4>",
"</div>",
"<div class='panel panel-default'>",
"<div class='panel-heading text-center'>",
"<h3> what would you like to do?</h3>",
"</div>",
"<div class='panel-body text-center'>",
"<h4><a href='saved'> Go to Saved Articles</a></h4>",
"</div>",
"</div>"
].join(""));

articleContainer.append(emptyAlert);
}


function handleArticleSave() {

    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;

    $.ajax({
        method:"PUT",
        url:"/api/articles",
        data: JSON.stringify(articleToSave)
    })
    .then(function(data){
        // if succeful , mongoose  will send back an object containing  a key of "ok" with the value of 1
        // which casts to "true"

        if (data.ok){
            initPage();
        }
    }).catch(function(err){
      
        console.log("something is wrong with the PUT")
    });
}

function handleArticleScrape() {
    console.log("in article scrape")
    $.get("/api/fetch")
        .then(function(data){
console.log(data)
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");

        });
}
});




// // grab all the articles as json
// $("#scrape-button").on("click", function () {
//     $.get("/api/scrape", function (){

        
//     });
// });



// //save Article, so the article can be inserted into the saved articles page

// $("#save-button").on("click", function () {

//     let articleId = $(this).attr('data-id');

//     $.post(`savedArticles/${articleId}`, function () {

//     });
// });



// // Open  modal when clicking the open modal button, (saving and closing methods inside of it)

// $('#open-modal').on('click', function () {

// // open modal
//  $('#note-modal').modal('toggle');

//  // create Note and associate it with the article

//     $('#note-create').on('click', function(){

//         let articleId = $(this).attr('data-id');

//         // text area note info

//         let noteInfo = $('note-content').val().trim();

//         $.post(`/articles/${articleId}`,noteInfo);

//         // empty modal text area
//         $('#note-content').empty();
        
//     });
// });




