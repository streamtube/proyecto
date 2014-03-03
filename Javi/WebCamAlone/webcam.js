navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

function callWebCam(callbackTodoBien, callbackTodoMal) {
    navigator.getMedia({video: true, audio: true}, callbackTodoBien, callbackTodoMal);
}