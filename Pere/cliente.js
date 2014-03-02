/**
 * Created by pere on 9/02/14.
 */
$(document).ready(function(){
    var urlServer = location.origin + ':8081';
    var socket = io.connect(urlServer);

    $("#boton").on('click', function() {
        var mensajeEscrito = $("#mensajeEscrito").val();
        socket.emit("mensaje", {msg: mensajeEscrito});
    });

    socket.on("mensaje", function(msg) {
        console.log("Hemos recibido un mensaje", msg);
        var mensajeReal = msg.msg;
        $("#mensajes").append("<li>"+mensajeReal+"</li>");
    });
});

