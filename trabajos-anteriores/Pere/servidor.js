/**
 * Created by pere on 9/02/14.
 */
var server = require('http').createServer(),
    sio = require('socket.io'),
    port = 8081;
server.listen(port);
var io = sio.listen(server, {log:true});
var channels = {};
io.sockets.on('connection', function (socket) {
    console.log("Cliente coenctado");

    socket.on('mensaje', function (msg){
        console.log(msg);
        socket.broadcast.emit('mensaje', msg);
    });
});

console.log('1- Escuchando en http://localhost:' + port , "");
console.log("");