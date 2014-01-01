/**
 * Created by root on 1/1/14.
 */

var server  = require('http').createServer(),
    sio      = require('socket.io'),
    port    = 8082;
server.listen(port);
var io = sio.listen(server, { log:true });
var channels = {};
io.sockets.on('connection', function (socket) {
    console.log("Cliente conectado");
});
    console.log('1- Escuchando en http://localhost:' + port , "");
    console.log("");

$(document).ready(function() {
    var urlServer = location.origin + ':8082';
    var socket = io.connect(urlServer);


    $("#boton").on('click', function() {
        var mensaje = $("#write").val();
        socket.emit("mensaje", {msg: mensaje});
    });
    socket.on("mensaje", function(msg) {
        console.log("hemos recibido un mensaje", msg);
    });
    socket.on("mensaje", function(msg) {
        console.log("hemos recibido un mensaje", msg);
        var mensajeReal = msg.msg;
        $( "#mensajes" ).append( "<p>+mensajeReal+</p>" );
    });

});
