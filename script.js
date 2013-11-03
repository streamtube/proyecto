
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia(
    {audio:true, video: true},
    function(vid)
    {
        document.getElementById("local").src = window.URL.createObjectURL(vid);
    },
    function(error) {
        console.log(error);
    }
);