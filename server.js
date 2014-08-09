var server  = require('http').createServer(),
    sio      = require('socket.io'),
    port    = 8081;
server.listen(port);
var io = sio.listen(server, { log:true });

var channels = {};

io.sockets.on('connection', function (socket) {
    console.log('[+]','****** '+socket.id+' ******');
    console.log('[+]', socket.handshake.time, " -> Cliente conectado ");
    console.log('[+]', socket.handshake.headers['user-agent']);
    console.log('[+]','****** '+socket.id+' ******');

    var initiatorChannel = '';
    if (!io.isConnected)
        io.isConnected = true;

    socket.on('new-channel', function (data) {
        channels[data.channel] = data.channel;
        console.log("Nuevo canal", data);
        onNewNamespace(data.channel, data.sender);
    });

    socket.on('presence', function (channel) {
        var isChannelPresent = !! channels[channel];
        socket.emit('presence', isChannelPresent);
        if (!isChannelPresent)
            initiatorChannel = channel;
    });

    socket.on('disconnect', function (channel) {
        console.log('[+]','****** '+socket.id+' ******');
        console.log('[+]', socket.handshake.time, "Cliente desconectado ", channel);
        console.log('[+]', socket.handshake.headers['user-agent']);
        console.log('[+]','****** '+socket.id+' ******');
        if (initiatorChannel)
            channels[initiatorChannel] = null;
    });

    socket.emit('conectado', socket.id);
});

function onNewNamespace(channel, sender) {
    io.of('/' + channel).on('connection', function (socket) {
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            if (data.sender == sender)
                socket.broadcast.emit('message', data.data);
        });

        socket.on('youtube', function(data) {
            console.log("Reenviando mensaje de youtube a "+channel);
            console.log(data);
            socket.broadcast.emit('youtube', data);
        });
    });
}

console.log('[+]','Escuchando http://localhost:' + port , "\n");