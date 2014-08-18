globals.socket = io.connect(location.origin);

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
            var boton = document.createElement('button');
            boton.type = 'button';
            boton.canal = canales[canal].nombre;
            boton.onclick = botonUnirseAUnCanalClicado;
            boton.textContent = 'Unirse al canal '+canales[canal].nombre+' de '+canales[canal].creador;
            listItem.appendChild(boton);
            unorderedList.appendChild(listItem);
        }
    }

    listaCanales.appendChild(unorderedList);
});