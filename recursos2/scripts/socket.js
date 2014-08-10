var socket = io.connect(location.origin + ':8081');

socket.on('conectado', function(data) {
    console.dir(data);
    var jsUsername = document.getElementById('js-username');
    jsUsername.value = data;
});

socket.on('canales', function(canales) {
    console.log(canales);
    var listaCanales = document.getElementById('lista_canales');
    var li = document.createElement('ul');
    for(canal in canales) {
        var li = document.createElement('li');
        li.textContent = 'Canal: '+canales[canal].nombre+" ("+canales[canal].creador+")";
        listaCanales.appendChild(li);
    }
});