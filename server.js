var server  = require('http').createServer(),
    sio      = require('socket.io'),
    port    = 8081;
server.listen(port);
var io = sio.listen(server, { log:true });

var ip = 'localhost';
var os=require('os');
var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
        if (details.family=='IPv4' && dev !== 'lo') {
            ip = details.address;
            ++alias;
        }
    });
}


var users = {};
var channels = {};

io.sockets.on('connection', function (socket) {
    log(socket, "Cliente conectado", socket.handshake.headers['user-agent']);

    if (!io.isConnected)
        io.isConnected = true;

    socket.on('new-channel', function (data) {
        channels[data.nombre] = {
            nombre: data.nombre,
            creador: socket.id
        };
        log(socket, 'Nuevo canal: '+data.nombre);
        onNewNamespace(data.nombre, socket.id);
        console.log('[+]','Escuchando el canal en la dirección', 'http://'+ip+':' + port +"/"+data.nombre, "\n");
        socket.emit('canal_creado', {nombre:data.nombre});
        socket.broadcast.emit('nuevo canal', {nombre:data.nombre});
    });

    socket.on('disconnect', function (channel) {
        log(socket, "Cliente desconectado ", channel);
        delete users[socket.id];
    });

    users[socket.id] = {name: socket.id};
    socket.emit('conectado', socket.id);
    socket.emit('canales', channels);
});

function onNewNamespace(channel, sender) {
    io.of('/' + channel).on('connection', function (socket) {
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            if (socket.id == sender)
                socket.broadcast.emit('message', data.data);
        });

        socket.on('youtube', function(data) {
            log(socket, "Reenviando mensaje de youtube a "+channel, data);
            socket.broadcast.emit('youtube', data);
        });

        socket.emit('canal-conectado', {url: socket.handshake.headers.referrer+'?c='+channel+'&s='+socket.id});
    });
}


function log(socket, message, extra) {
    console.log('[+]','****** '+socket.id+' ******');
    console.log('[+]', socket.handshake.time, " -> "+message);
    if(extra) {
        console.log('[+]', extra);
    }
    console.log('[+]','****** '+socket.id+' ******');
}

console.log('[+]','Escuchando en la dirección', 'http://'+ip+':' + port , "\n");