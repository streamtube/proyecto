<script src="jquery.js" type="text/javascript"></script>

$("#botoncrear").on("click", function () {
    var "youtubeid" = $("#youtubeid").val();}
var url = "http://youtube.com/watch?v="+youtubeid;
$("#videoiframe").attr("src", url);

});