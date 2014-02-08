// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


//La variable player es el video de Youtube
var player;

var nivelDeBloqueo = 0;

var ultimaAccion;

function crearVideoDeYoutube(id) {
    if(!player) {
        player = new YT.Player('video-youtube', {
            height: '390',
            width: '640',
            origin: 'http',
            videoId: id,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onYouTubeIframeAPIReady() {
    console.log("API de youtube lista!")
}

function onPlayerReady(event) {
    console.log("El video está listo!");
}

function onPlayerStateChange(event) {
    var idEvento = event.data;

    nivelDeBloqueo = nivelDeBloqueo - 1;
    if(nivelDeBloqueo > 0) {
        console.log("La última acción no la has hecho tú. No se re-enviarán las acciones al servidor");
        console.log("Nivel De Bloqueo: ", nivelDeBloqueo);
        return;
    }

    if(idEvento === YT.PlayerState.PLAYING && ultimaAccion !== YT.PlayerState.PLAYING) {
        console.log("Tu has reproducido el video");
        ultimaAccion = YT.PlayerState.PLAYING;
        sendVideoStarted(event.target);
    }
    else if(idEvento === YT.PlayerState.PAUSED && ultimaAccion !== YT.PlayerState.PAUSED) {
        console.log("Tu has pausado el video");
        ultimaAccion = YT.PlayerState.PAUSED;
        sendVideoPaused(event.target);
    }
}

/**
 * Esta funcion se llama cuando el servidor nos avisa de que
 * alguien de la conferencia ha pausado o reproducido el video
 */
function onVideoMessage(response) {
    if(response.videoPaused) {
        nivelDeBloqueo = 1;
        console.log("Alguien ha pausado el video");
        player.seekTo(response.segundos);
        player.getVideoUrl();
        player.pauseVideo();
    }

    if(response.videoStarted) {
        nivelDeBloqueo = 1;
        console.log("Alguien ha comenzado el video");
        player.seekTo(response.segundos);
        player.getVideoUrl();
        player.playVideo();
    }

    if(response.videoId) {
        nivelDeBloqueo = 1;
        console.log("Otro usuario ha cargado un video!");
        crearVideoDeYoutube(response.videoId);
    }
}


//La variable conferenceUI contiene todas las funciones que estan en conference.js
//La funcion más importante es getSocket que obtiene el socket para llamar al servidor
// var socket = conferenceUI.getSocket();
var conferenceUI;

function sendVideoPaused(info) {
    var socket = conferenceUI.getSocket();
    var pausa = { segundos: player.getCurrentTime(), videoPaused: true, videoStarted: false };
    socket.emit("youtube", pausa);
    console.log("funciona");
}

function sendVideoStarted(info) {
    var socket = conferenceUI.getSocket();
    var hasa = { segundos: player.getCurrentTime(), videoPaused: false, videoStarted: true };
    socket.emit("youtube", hasa);
    console.log("eres gay");
}

$(document).ready(function() {
    $("#botoncrear").on("click",function () {
        var videoID = $("#youtubeid").val();
        crearVideoDeYoutube(videoID);
        var socket = conferenceUI.getSocket();
        var datos = { videoId: videoID, videoPaused: false, videoStarted: false };
        socket.emit("youtube", datos);
    });
});