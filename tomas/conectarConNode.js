window.onload = function() {
    var urlServer = location.origin + ':8081';
    var socket = io.connect(urlServer);
    socket.emit('username', {username: navigator.userAgent});
};