callWebCam(
    function(streamWebCam) {
        var video = document.createElement("video");
        video.src=streamWebCam;
        document.body.appendChild(video);
    },
    function(error) {
        alert("Tu navegador es un poco mierdoso porque no detecta la webcam. Error: "+error);
    });