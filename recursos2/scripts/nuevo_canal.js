;(function(socket) {
    var button_new_channel = document.getElementById('js_new_channel_buton');
    button_new_channel.addEventListener('click', function() {
        var channelName = document.getElementById('js_new_channel_name').value;
        if(!channelName) {
            var errorBloque = document.getElementById('js_new_channel_error');
            errorBloque.value = "¡El nombre del canal no puede estar vacío!";
            return false;
        }

        socket.emit('new-channel', {channel: channelName});
        return true;
    });
})(socket);