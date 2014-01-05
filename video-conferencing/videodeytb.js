//La variable player es el video de Youtube
var player;

function crearVideoDeYoutube() {
    player = new YT.Player('contenedor', {
        height: '390',
        width: '640',
        videoId: $("#youtubeid").val(),
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onYouTubeIframeAPIReady() {
    console.log("API de youtube lista!")
}

function onPlayerReady(event) {
    console.log("El video está listo!");
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log("Alguien ha cambiado el estado del video", event);
}

$(document).ready(function() {
    $("#botoncrear").on("click",function () {
        crearVideoDeYoutube();
    });
});