$("#botoncrear").on("click", function () {
    var variable = $("#youtubeid").val();
    var url = "http://youtube.com/watch?v=" + variable;
    $("#videoiframe").attr("src", url);
});