$(document).ready(function() {
    var urlServer = location.origin + ':8081';
    var socket = io.connect(urlServer);

    $("#boton").on('click', function() {
        var mensaje = $("#mensaje").val();
        socket.emit("mensaje", {msg: mensaje});
    });

    socket.on("mensaje", function(msg) {
        console.log("hemos recibido un mensaje", msg);
    });
});