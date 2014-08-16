var Canales = function() {

};

Canales.prototype.crearCanal = function(nombreCanal) {
    var defer = Q.defer();
    globals.socket.emit('new channel', {nombre: nombreCanal});

    globals.socket.on('canal creado', (function() {
        var conexionCanalPromise = this.conectarseCanal(nombreCanal);
        conexionCanalPromise.then(function(urlObjeto) {
            defer.resolve(urlObjeto);
        });
        conexionCanalPromise.fail(function(error) {
            defer.reject(error);
        });
    }).bind(this));

    globals.socket.on('canal no creado', function canalCreadoError(error) {
        defer.reject(new Error(error));
    });

    return defer.promise;
};

Canales.prototype.conectarseCanal = function(nombreCanal) {
    var defer = Q.defer();
    console.log("Camara conectada, procediendo a conectarse al canal "+ nombreCanal);
    globals.socketCanal = io.connect(location.origin + ':8081/'+nombreCanal);
    globals.socketCanal.on('canal conectado', function(urlObjeto) {
        console.log(urlObjeto.url);
        defer.resolve(urlObjeto);
    });

    return defer.promise;
};
