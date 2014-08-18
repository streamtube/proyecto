navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

var Webcam = function() {
    this.stream = null;
};

Webcam.prototype.callbackVideoAceptado = function(streamWebCam) {
    var video = new Video();
    video.cargarVideo(streamWebCam);
    this.stream = streamWebCam;
};

Webcam.prototype.callbackVideoDenegado = function(error) {
    alert("Tu navegador es un poco mierdoso porque no detecta la webcam. Error: "+error);
    console.dir(error);
};

Webcam.prototype.callWebCam = function() {
    var defer = Q.defer();
    navigator.getMedia(
        {video: true,audio: true},
        function(streamwebcam) { defer.resolve(streamwebcam);},
        function(error) { defer.reject(error); }
    );

    var promise = defer.promise;
    promise.then(this.callbackVideoAceptado);
    promise.fail(this.callbackVideoDenegado);

    return promise;
};
