var Video = function() {
    this.video = null;
    this.mute = null;
    this.volum = null;
};

/**
 * @param streamWebCam
 */
Video.prototype.cargarVideo = function(streamWebCam) {
    var contenedor = document.createElement("div");
    contenedor.className = "contenedor";

    this.video = document.createElement("video");
    contenedor.appendChild(this.video);

    this.video.className = "video";
    this.video.autoplay = true;

    this.video.src = window.URL.createObjectURL(streamWebCam);

    this.video.play();

    var conBotones = document.createElement("div");
    conBotones.className = "conBotones";

    this.mute = document.createElement("button");
    this.mute.type = "button";
    this.mute.className = "mute boton";
    this.mute.textContent = "Mute";
    conBotones.appendChild(this.mute);

    this.volum = document.createElement("input");
    this.volum.className = "volum";
    this.volum.type = "range";
    this.volum.min = "0";
    this.volum.max = "1";
    this.volum.step = "0.1";
    this.volum.value = "1";
    conBotones.appendChild(this.volum);

    contenedor.appendChild(conBotones);
    document.body.appendChild(contenedor);

    this.mute.addEventListener("click", this.onClickMuteVideo.bind(this));
    this.volum.addEventListener("change", this.onChangeVolumVideo.bind(this));
};

Video.prototype.onClickMuteVideo = function() {
    if (this.video.muted == false) {
        // Mute the video
        this.video.muted = true;

        // Update the button text
        this.mute.innerHTML = "Unmute";
    } else {
        // Unmute the video
        this.video.muted = false;

        // Update the button text
        this.mute.innerHTML = "Mute";
    }
};

Video.prototype.onChangeVolumVideo = function() {
    this.video.volume = this.volum.value;
};