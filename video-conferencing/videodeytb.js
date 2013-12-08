$(document).ready(function() {
$("#botoncrear").on("click",function () {
    var variable = $("#youtubeid").val();
    var url = "www.youtube.com/embed/" + variable;
    $("#videoiframe").attr("src", url);
});
});