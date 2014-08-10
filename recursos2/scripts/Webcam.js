navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

var Webcam = function() {};

Webcam.prototype.callbackVideoAceptado = function(streamWebCam) {
    var video = new Video();
    video.cargarVideo(streamWebCam);
};

Webcam.prototype.callbackVideoDenegado = function(error) {
    alert("Tu navegador es un poco mierdoso porque no detecta la webcam. Error: "+error);
    console.dir(error);
};

Webcam.prototype.callWebCam = function() {
    navigator.getMedia({video: true,audio: true}, this.callbackVideoAceptado, this.callbackVideoDenegado);
};
