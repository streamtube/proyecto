var Webcam = function() {
    this.stream = null;
};

Webcam.prototype.callbackVideoAceptado = function(streamWebCam) {
    var video = new Video();
    video.cargarVideo(streamWebCam);
    this.stream = streamWebCam;
};

Webcam.prototype.callWebCam = function() {
    var defer = Q.defer();
    getUserMedia(
        {video: true,audio: true},
        function(streamwebcam) { defer.resolve(streamwebcam);},
        function(error) { defer.reject(error); }
    );

    var promise = defer.promise;
    promise.then(this.callbackVideoAceptado);

    return promise;
};
