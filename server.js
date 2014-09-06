var express = require('express'),
    http  = require('http'),
    sio      = require('socket.io'),
    port    = process.env.PORT || 8081,
    fs = require('fs'),
    cookieParserExports = require('cookie-parser'),
    cookie = require('cookie'),
    session = require('express-session'),
    path = require('path'),
    debugExports = require('debug');

debugExports.enable('*');

var debug = debugExports('streamtube');

var app = express();

app.use(cookieParserExports());
app.use(session({
        secret: 'SECRET',
        cookie: {httpOnly: true},
        saveUninitialized: true,
        resave: true
    }
));

// serve index.html for every path
app.get('/', function(req, res) {
    fs.readFile(path.join(__dirname, "/index.html"), 'utf8', function(err, data) {
        if (err) throw err;
        res.writeHead(200);
        res.end(data);
    });
});
// serve public folder
app.use(express.static(__dirname + '/recursos'));
app.use(express.static(__dirname + '/node_modules'));

var server = http.createServer(app);
var io = sio.listen(server);

server.listen(port);

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

io.use(function(socket, next) {
    debug("Cookie:", socket.request.headers.cookie);
    if (socket.request.headers.cookie) {
        socket.request.cookie = cookie.parse(socket.request.headers.cookie);
        debug("Parsed Cookie:", socket.request.cookie);
        var signedCookie = socket.request.cookie['connect.sid'];
        socket.request.sessionID = cookieParserExports.signedCookie(signedCookie, 'SECRET');
        if (signedCookie == socket.request.sessionID) {
            debug("Cookie is invalid.");
            return next(new Error('Cookie is invalid.'));
        }
    } else {
        debug("No cookie transmitted.");
        return next(new Error('No cookie transmitted.'));
    }

    debug("Accept cookie");
    return next();
});


io.sockets.on('connection', function (socket) {
    log(socket, "Cliente conectado", socket.handshake.headers['user-agent']);
    var cookie_string = cookie.parse(socket.request.headers.cookie);
    debug(cookie_string);

    if (!io.isConnected)
        io.isConnected = true;

    socket.on('new channel', function (data) {
        channels[data.nombre] = {
            nombre: data.nombre,
            creador: socket.id
        };
        users[socket.id].channel = data.nombre;

        log(socket, 'Nuevo canal: '+data.nombre);
        onNewNamespace(data.nombre, socket.id);
        debug('[+]','Escuchando el canal en la dirección', 'http://'+ip+':' + port +"/"+data.nombre, "\n");
        socket.emit('canal creado', {nombre: data.nombre});
        socket.broadcast.emit('nuevo canal', {nombre: data.nombre});
    });

    socket.on('disconnect', function() {
        log(socket, "Cliente desconectado ");
        if(users[socket.id]['channel']) {
            var nombreCanalCreadoPorElUsuario = users[socket.id].channel;
            //delete channels[nombreCanalCreadoPorElUsuario];
        }
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
            data.socketId = socket.id;
            if(data.type == 'candidate') {
                debug(socket.id, "ICE -> "+channel);
            }
            else {
                log(socket, "Enviando mensaje en el canal "+channel, data);
            }
            socket.broadcast.emit('message', data);
        });

        socket.on('youtube', function(data) {
            log(socket, "Reenviando mensaje de youtube a "+channel, data);
            socket.broadcast.emit('youtube', data);
        });

        socket.on('disconnect', function() {
            log(socket, "Cliente desconectado del canal "+channel);
        });

        log(socket, "Cliente conectado al canal "+channel);
        socket.emit('canal conectado', {url: channel+'_'+socket.id});
        socket.broadcast.emit('message', {type:'nueva_persona', socketId: socket.id});
    });
}


function log(socket, message, extra) {
    var date = new Date(),
        user_agent = socket.handshake.headers['user-agent'],
        os = "Linux",
        browser = "Chrome";
    if(/Windows/.test(user_agent)) {
        os = "Windows";
    }

    if(/Firefox/.test(user_agent)) {
        browser = "Firefox";
    }
    else if(/Chrome/.test(user_agent)) {
        browser = "Chrome";
    }
    else {
        browser = "IE?";
    }

    debug('[+]','****** '+os+' in '+browser+' ******');
    debug('[+]', date.toLocaleTimeString(), " -> "+message);
    if(extra) {
        debug('[+]', extra);
    }
    debug('[+]','****** '+os+' in '+browser+' ******\n');
}

debug('[+]','Escuchando en la dirección', 'http://'+ip+':' + port , "\n");