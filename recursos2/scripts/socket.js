var urlServer = location.origin + ':8081';
var socket = socket || io.connect(urlServer);

socket.on('conectado', function(data) {
    console.dir(data);
    var jsUsername = document.getElementById('js-username');
    jsUsername.value = data;
});