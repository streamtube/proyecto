var Canales = function() {};

Canales.prototype.crearCanal = function(nombreCanal) {
    var defer = Q.defer();

    globals.socket.emit('new channel', {nombre: nombreCanal});
    globals.socket.on('canal creado', function() { defer.resolve(nombreCanal); });
    globals.socket.on('canal no creado', function(error) { defer.reject(new Error(error)); });

    return defer.promise;
};

Canales.prototype.conectarseCanal = function(nombreCanal) {
    var defer = Q.defer();
    console.log("Procediendo a conectarse al canal "+ nombreCanal);
    globals.socketCanal = io.connect(location.origin + '/' + nombreCanal);
    var self = this;
    globals.socketCanal.on('canal conectado', function(urlObjeto) {
        console.log("Conectado al canal "+ nombreCanal);
        defer.resolve(urlObjeto);
        globals.socketCanal.on('message', self.mensajeRecibido.bind(self));
    });

    return defer.promise;
};

Canales.prototype.mensajeRecibido = function(message) {
    console.group('[PeerConnection] Mensaje Recibido "%s"', message.type);
    if(message.type === 'nueva_persona') {
        console.log(message.socketId);
        this.seHaUnidoUnaNuevaPersonaAlCanal(message.socketId);
        console.groupEnd();
        return;
    }

    if(!globals.peerConnections[message.socketId]) {
        console.log("No esta creado aun el peer connection del "+message.socketId);
        console.log("Creando Peerconnection");
        globals.peerConnections[message.socketId] = new PeerConnection(message.socketId);
        globals.peerConnections[message.socketId].createPeerConnection(globals.localStream);
    }

    var peerConnection = globals.peerConnections[message.socketId];

    if (message.type === 'offer') {
        peerConnection.SDPReceived(message);
    } else if (message.type === 'answer') {
        peerConnection.answerSDPReceived(message);
    } else if (message.type === 'candidate') {
        peerConnection.ICEReceived(message);
    } else if (message === 'bye') {
        //handleRemoteHangup();
    }
};

Canales.prototype.seHaUnidoUnaNuevaPersonaAlCanal = function(socketId) {
    console.log("Se ha unido una nueva persona al canal");
    if(!globals.localStream) {
        console.log("Pero yo aun no he agregado mi cam!");
        return;
    }

    console.log("Creando Peerconnection");
    globals.peerConnections[socketId] = new PeerConnection(socketId);
    globals.peerConnections[socketId].createPeerConnection(globals.localStream);
    globals.peerConnections[socketId].doCall();
};
