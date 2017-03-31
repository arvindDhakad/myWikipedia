'use strict';


// my wikipedia module
function myWikipedia() {

    //wikipedia rest api url
    this.apiUrls = {'html' : '.wikipedia.org/api/rest_v1/page/html/',
     'summary': '.wikipedia.org/api/rest_v1/page/summary/'};

   // initialize the parameters and dom elements
    this.defaultPageTitle = 'My Wikipedia';
    this.contentEl = 'mainContent';
    this.pageTitleEl = 'titleNav';
    this.loaderEl = 'loaderOverlay';
    this.notFoundText = '<h1 class="notFound">Article Not Found :(</h1>';
}
myWikipedia.prototype = {
    /*
     * Uses wikipedia's RestAPI(v1) to fetch the page contents in html using AJAX.
     */
    fetchArticle: function(lang, title,isSummary= false) {
        this.showLoader();
        var response_ ={title: this.defaultPageTitle, content : ''};
        var url;
        var request = new XMLHttpRequest();
        if(isSummary===true)
        url = 'https://' + lang + this.apiUrls.summary + title;
        else url = 'https://' + lang + this.apiUrls.html + title;

        request.open('get', url, true);
        request.setRequestHeader('Accept', 'text/html');

        request.onreadystatechange = function() {
            var DONE = XMLHttpRequest.DONE || 4;
            // response and error handling
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                  if(isSummary===true){
                    var jsonData = JSON.parse(request.response);
                    response_.title = jsonData.title;
                    response_.content = jsonData.extract;
                  }else{
                    response_.content = request.response;
                  }
                this.hideLoader();
            } else if ((request.readyState === XMLHttpRequest.DONE && request.status === 404) || request.readyState === XMLHttpRequest.UNSENT) {
                response_.content = this.notFoundText;
                this.hideLoader();
            }
            // else if(request.readyState === XMLHttpRequest.DONE && (request.status === 301 ||request.status === 302) ){

            // }
            // console.log(request.status);
            document.getElementById(this.pageTitleEl).innerHTML = response_.title;
            document.getElementById(this.contentEl).innerHTML = response_.content;
            document.getElementById('sidebar').className = "hidden";
        }.bind(this);

        request.onerror = function() {
          response_.content = this.notFoundText;
          this.hideLoader();
          document.getElementById(this.pageTitleEl).innerHTML = response_.title;
          document.getElementById(this.contentEl).innerHTML = response_.content;
        }.bind(this);


        request.send();
    },
    // shows the spinner
    showLoader: function() {
        document.getElementById(this.loaderEl).className = "shown";
    },
    //hider the spinner
    hideLoader: function() {
        document.getElementById(this.loaderEl).className = "hidden";
    },

}


//page level js and event handlers

//initialize the module
var wiki = new myWikipedia();

document.getElementById('searchBtn').addEventListener('click', function(e) {
    e.preventDefault();

    //get the form values
    var selectElement = document.getElementById('langSelector');
    var isSummary = document.getElementById('isSummary').checked;
    var lang = selectElement.options[selectElement.selectedIndex].value;
    var article = document.getElementById('articleName').value;

    //check if values are not empty
    if (lang == '' || article == '') alert('Please enter something to search :)');
    else {
        wiki.fetchArticle(lang, article,isSummary);
    }
});


document.getElementById('hamburgerIcon').addEventListener('click', function(e) {
    // e.preventDefault();
    if (document.getElementById('sidebar').className === "shown") {
        document.getElementById('sidebar').className = "hidden";
    } else document.getElementById('sidebar').className = "shown";

});
window.addEventListener('resize', function() {
    if (window.innerWidth <= 480) document.getElementById('sidebar').className = "hidden";
    else document.getElementById('sidebar').className = "shown";
});
