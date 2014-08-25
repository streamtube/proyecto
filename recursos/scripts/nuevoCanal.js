var button_new_channel = document.getElementById('js_new_channel_buton');
button_new_channel.addEventListener('click', botonCrearCanalClicado);

function botonCrearCanalClicado() {
    var errorBloque = document.getElementById('js_new_channel_error');
    errorBloque.textContent = '';

    var channelName = document.getElementById('js_new_channel_name').value;
    if(!channelName) {
        errorBloque.textContent = "¡El nombre del canal no puede estar vacío!";
        return false;
    }

    var canales = new Canales();
    var promiseCrearCanal = canales.crearCanal(channelName);
    promiseCrearCanal.then(unirseAUnCanal);

    return true;
}

globals.socket.on('canales', function listaDeCanales(canales) {
    var listaCanales = document.getElementById('lista_canales');
    var unorderedList = document.createElement('ul');
    for(canal in canales) {
        if(canales.hasOwnProperty(canal)) {
            var listItem = document.createElement('li');
            var boton = document.createElement('button');
            boton.type = 'button';
            boton.canal = canales[canal].nombre;
            boton.textContent = 'Unirse al canal '+canales[canal].nombre+' de '+canales[canal].creador;
            boton.addEventListener('click', function() {
                unirseAUnCanal(canales[canal].nombre);
            });

            listItem.appendChild(boton);
            unorderedList.appendChild(listItem);
        }
    }

    listaCanales.appendChild(unorderedList);
});

function unirseAUnCanal(channelName) {
    var canales = new Canales();
    canales.conectarseCanal(channelName)
        .then(function(urlObjeto) {
            modificarVistaParaElCanal(channelName, urlObjeto.url);
        });
    return true;
}

function modificarVistaParaElCanal(channelName, url) {
    document.getElementById('home-content').style.display = "none";
    var channelContent = document.getElementById('channel-content');
    channelContent.style.display = "block";
    var titulo = channelContent.querySelector('.titulo');
    titulo.textContent = channelName;
    history.pushState("Canal "+channelName, "Canal "+channelName, '?u='+url);
}