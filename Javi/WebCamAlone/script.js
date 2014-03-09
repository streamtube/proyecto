callWebCam(
    function(streamWebCam) {
        var video = document.createElement("video");
        video.src= window.URL.createObjectURL(streamWebCam) || streamWebCam;
        video.play();
        document.body.appendChild(video);
    },
    function(error) {
        alert("Tu navegador es un poco mierdoso porque no detecta la webcam. Error: "+error);
    });