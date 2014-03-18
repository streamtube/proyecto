callWebCam(
    function(streamWebCam) {


        var contenedor = document.createElement("div");
        contenedor.id = "contenedor";

        var video = document.createElement("video");
        video.id = "video";
        video.src= window.URL.createObjectURL(streamWebCam) || streamWebCam;
        video.play();
        contenedor.appendChild(video);

        var conBotones = document.createElement("div");
        conBotones.id = "conBotones";

        var mute = document.createElement("button");
        mute.type = "button";
        mute.id = "mute";
        mute.innerText = "Mute";
        conBotones.appendChild(mute);

        var volum = document.createElement("input");
        volum.id = "volum";
        volum.type = "range";
        volum.min = "0";
        volum.max = "1";
        volum.step = "0.1";
        volum.value = "1";
        conBotones.appendChild(volum);

        contenedor.appendChild(conBotones);
        document.body.appendChild(contenedor);

        mute.addEventListener("click", function() {
            if (video.muted == false) {
                // Mute the video
                video.muted = true;

                // Update the button text
                mute.innerHTML = "Unmute";
            } else {
                // Unmute the video
                video.muted = false;

                // Update the button text
                mute.innerHTML = "Mute";
            }
        });

        volum.addEventListener("change", function() {
            // Update the video volume
            video.volume = volum.value;
        });
    },
    function(error) {
        alert("Tu navegador es un poco mierdoso porque no detecta la webcam. Error: "+error);
    });