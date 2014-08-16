var button_new_channel = document.getElementById('js_new_channel_buton');
button_new_channel.addEventListener('click', botonCrearCanalClicado);

function botonCrearCanalClicado() {
    var errorBloque = document.getElementById('js_new_channel_error');
    errorBloque.textContent = '';

    var channelName = document.getElementById('js_new_channel_name').value;
    if(!channelName) {
        errorBloque.textContent = "¡El nombre del canal no puede estar vacío!";
        return false;
    }

    var canales = new Canales();
    var promiseCrearCanal = canales.crearCanal(channelName);
    promiseCrearCanal
        .then(function(urlObjeto) {
            modificarVistaParaElCanal(channelName, urlObjeto.url);
            var localWebCam = new Webcam();
            return localWebCam.callWebCam();
        })
        .then(function(localStream) {
            var peerConnection = new PeerConnection();
            peerConnection.createPeerConnection();
            peerConnection.addStream(localStream);
            peerConnection.doCall();
        })
        .catch(function(error) {
            alert(error);
            console.error(error);
        });

    return true;
}

function botonUnirseAUnCanalClicado() {
    var channelName = this.canal;
    var canales = new Canales();
    var promiseConectarseCanal = canales.conectarseCanal(channelName);
    promiseConectarseCanal
        .then(function(urlObjeto) {
            modificarVistaParaElCanal(channelName, urlObjeto.url);
            var localWebCam = new Webcam();
            return localWebCam.callWebCam();
        })
        .then(function(localStream) {
            var peerConnection = new PeerConnection();
            peerConnection.createPeerConnection();
            peerConnection.addStream(localStream);
            peerConnection.doCall();
        })
        .catch(function(error) {
            alert(error);
            console.error(error);
        });

    return true;
}

function modificarVistaParaElCanal(channelName, url) {
    document.getElementById('home-content').style.display = "none";
    var channelContent = document.getElementById('channel-content');
    channelContent.style.display = "block";
    var titulo = channelContent.querySelector('.titulo');
    titulo.textContent = channelName;
    history.pushState("Canal "+channelName, "Canal "+channelName, 'video.html?u='+url);
}
