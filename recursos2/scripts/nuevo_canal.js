var webcam = new Webcam();

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

    socket.emit('new-channel', {nombre: channelName});
    return true;
}

socket.on('canal_creado', function(channel) {
    document.getElementById('home-content').style.display = "none";
    var channelContent = document.getElementById('channel-content');
    channelContent.style.display = "block";
    var titulo = channelContent.querySelector('.titulo');
    titulo.textContent = channel.nombre;

    webcam.callWebCam();
});
