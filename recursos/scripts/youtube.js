//La variable player es el video de Youtube
var player;

//La variable config es la que se usa en configConference.js
var config;

function crearVideoDeYoutube() {
    player = new YT.Player('contenedor', {
        height: '390',
        width: '640',
        origin: 'http',
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
    //¿Como podemos ver si el cambio ha sido producido por el usuario local o otro usuario de la conferencia?
    console.log("Alguien ha cambiado el estado del video", event);
    var idEvento = event.data;

    if(idEvento === YT.PlayerState.PLAYING) {
        console.log("Alguien ha reproducido el video");
        sendVideoStarted(event.target);
    }
    else if(idEvento === YT.PlayerState.PAUSED) {
        console.log("Alguien ha pausado el video");
        sendVideoPaused(event.target);
    }
}

function sendVideoPaused(info) {
    config.sendVideoPaused(info);
}
function sendVideoStarted(info) {
    config.sendVideoStarted(info);
}
function onVideoPaused(info) {
    //El servidor nos notifica que el video se ha pausado
}
function onVideoStarted(info) {
    //El servidor nos notifica que el video se ha reproducido
}


$(document).ready(function() {
    $("#botoncrear").on("click",function () {
        crearVideoDeYoutube();
    });
});