/**
 * Created by root on 12/30/13.
 */

$(document).ready(function() {
    var urlServer = location.origin + ':8082';
    var socket = io.connect(urlServer);

    $("#boton").on('click', function() {
        var mensaje = $("#campotexto").val();
        console.log(mensaje);
        socket.emit("mensaje", {msg: mensaje});

    });

    socket.on("mensaje", function(msg) {
        console.log("hemos recibido un mensaje", msg);
        var mensajeReal = msg.msg;
        $( "#mensajes" ).append( "<p>"+mensajeReal+"</p>" );
    });
});