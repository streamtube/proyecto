/**
 * Created by root on 12/30/13.
 */
var server  = require('http').createServer(),
    sio      = require('socket.io'),
    port    = 8082;
server.listen(port);
var io = sio.listen(server, { log:true });

io.sockets.on('connection', function (socket) {
    console.log("Cliente conectado");

    socket.on('mensaje', function (msg) {
        console.log(msg);
        socket.broadcast.emit('mensaje', msg);
    });
});
console.log('1- Escuchando en http://localhost:' + port , "");
console.log("");