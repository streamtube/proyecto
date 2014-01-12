//La variable player es el video de Youtube
var player;

var loHeHechoYo = true;

function crearVideoDeYoutube(id) {
    player = new YT.Player('contenedor', {
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

function onYouTubeIframeAPIReady() {
    console.log("API de youtube lista!")
}

function onPlayerReady(event) {
    console.log("El video está listo!");
}

function onPlayerStateChange(event) {
    var idEvento = event.data;

    if(loHeHechoYo == false) {
        loHeHechoYo = true;
        return;
    }

    if(idEvento === YT.PlayerState.PLAYING) {
        console.log("Tu has reproducido el video");
        sendVideoStarted(event.target);
    }
    else if(idEvento === YT.PlayerState.PAUSED) {
        console.log("Tu has pausado el video");
        sendVideoPaused(event.target);
    }
}

/**
 * Esta funcion se llama cuando el servidor nos avisa de que
 * alguien de la conferencia ha pausado o reproducido el video
 * @param response
 */
function onVideoMessage(response) {
    loHeHechoYo = false;

    if(response.videoPaused) {
        console.log("Alguien ha pausado el video");
        //TODO: Escribir codigo para pausar el video

    }

    if(response.videoStarted) {
        console.log("Alguien ha comenzado el video");
        //TODO: Escribir codigo para reproducir el video

    }
}


//La variable conferenceUI contiene todas las funciones que estan en conference.js
//La funcion más importante es getSocket que obtiene el socket para llamar al servidor
// var socket = conferenceUI.getSocket();
var conferenceUI;

function sendVideoPaused(info) {
    //TODO: Escribir codigo para enviar al servidor que el video ha sido pausado

}
function sendVideoStarted(info) {
    //TODO: Escribir codigo para enviar al servidor que el video ha sido reproducido

}


$(document).ready(function() {
    $("#botoncrear").on("click",function () {
        var videoID = $("#youtubeid").val();
        crearVideoDeYoutube(videoID);
        //TODO: Escribir codigo para enviar al servidor que el video ha sido creado

    });
});