$(document).ready(function() {
$("#botoncrear").on("click",function () {
    var variable = $("#youtubeid").val();
    var url = "http://www.youtube.com/embed/" + variable;
    $("#videoiframe").attr("src", url);
});
});