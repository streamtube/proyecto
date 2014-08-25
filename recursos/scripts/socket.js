globals.socket = io.connect(location.origin);

globals.socket.on('conectado', function(data) {
    var jsUsername = document.getElementById('js-username');
    jsUsername.value = data;
});
