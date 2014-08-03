navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

function callWebCam(callbackTodoBien, callbackTodoMal) {
    navigator.getMedia({
        video: {
            "mandatory":{"maxWidth":"640","maxHeight":"360"}
        },
        audio: true
    },
        callbackTodoBien,
        callbackTodoMal
    );
}