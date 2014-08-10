navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

function callbackVideoAceptado(streamWebCam) {
    var video = new Video();
    video.cargarVideo(streamWebCam);
}

function callbackVideoDenegado(error) {
    alert("Tu navegador es un poco mierdoso porque no detecta la webcam. Error: "+error);
    console.dir(error);
}

function callWebCam() {
    navigator.getMedia({video: true,audio: true}, callbackVideoAceptado, callbackVideoDenegado);
}
