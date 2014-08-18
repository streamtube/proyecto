/*global gapi*/

// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#search-button').attr('disabled', false);
}

// Search for a specified string.
function search() {
    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet'
    });

    request.execute(function(response) {
        var str = JSON.stringify(response.result);
        $('#search-container').html('<pre>' + str + '</pre>');
    });
}
// Search for a specified string.
function searchGET() {
    var q = $('#query').val();

    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+q+"&key=AIzaSyAMM2O1jubIbmRfjuW_Hghsuvtcm2zGoTM";

    $.get(url, function(response) {
        var str = JSON.stringify(response.result);
        $('#search-container').html('<pre>' + str + '</pre>');
    });
}