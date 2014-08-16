globals.socket = io.connect(location.origin + ':8081');

globals.socket.on('conectado', function(data) {
    console.dir(data);
    var jsUsername = document.getElementById('js-username');
    jsUsername.value = data;
});

globals.socket.on('canales', function(canales) {
    console.log(canales);
    var listaCanales = document.getElementById('lista_canales');
    var unorderedList = document.createElement('ul');
    for(canal in canales) {
        if(canales.hasOwnProperty(canal)) {
            var listItem = document.createElement('li');
            listItem.textContent = 'Canal: '+canales[canal].nombre+" ("+canales[canal].creador+")";
            unorderedList.appendChild(listItem);
        }
    }

    listaCanales.appendChild(unorderedList);
});