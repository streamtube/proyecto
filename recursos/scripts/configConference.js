$(document).ready(function() {

    var config = {
        openSocket: function(config) {

            var channel = config.channel || "publico";
            var socket = new Firebase('https://streamtube.firebaseio.com/' + channel);
            socket.channel = channel;
            socket.on('child_added', function (data) {
                var value = data.val();
                if(value.youtube) {
                    onVideoMessage(value);
                }
                else {
                    config.onmessage(value);
                }
            });
            socket.send = function (data) {
                this.push(data);
            };
            config.onopen && setTimeout(config.onopen, 1);
            socket.onDisconnect().remove();
            return socket;
        },
        onRemoteStream: function(media) {
            var video = media.video;

            video.setAttribute('width', 600);
            video.setAttribute('controls', true);
            video.setAttribute('id', media.stream.id);

            videosContainer.insertBefore(video, videosContainer.firstChild);

            video.play();

            setTimeout(function() {
                // unmute audio stream for echo-cancellation
                // config.attachStream.getAudioTracks()[0].enabled = true;
            }, 2000);
            scaleVideos();
        },
        onRemoteStreamEnded: function(stream) {
            var video = document.getElementById(stream.id);
            if (video) {
                video.style.opacity = 0;
                setTimeout(function() {
                    video.parentNode.removeChild(video);
                    scaleVideos();
                }, 1000);
            }
        },
        onRoomFound: function(room) {
            var alreadyExist = document.querySelector('button[data-broadcaster="' + room.broadcaster + '"]');
            if (alreadyExist) return;

            if (typeof roomsList === 'undefined') roomsList = document.body;

            var tr = document.createElement('tr');
            tr.innerHTML = '<td>La conferencia <strong>' + room.roomName + '</strong> está disponible</td>' +
                '<td><button class="join">Unirse</button></td>';
            roomsList.insertBefore(tr, roomsList.firstChild);

            var joinRoomButton = tr.querySelector('.join');
            joinRoomButton.setAttribute('data-broadcaster', room.broadcaster);
            joinRoomButton.setAttribute('data-roomToken', room.roomToken);

            var callbackOnRoomClosed = this.onRoomClosed;

            joinRoomButton.onclick = function() {

                callbackOnRoomClosed(room);

                document.getElementById('conference-name').style.display = "none";
                btnSetupNewRoom.style.display = "none";

                var broadcaster = this.getAttribute('data-broadcaster');
                var roomToken = this.getAttribute('data-roomToken');
                captureUserMedia(function() {
                    conferenceUI.joinRoom({
                        roomToken: roomToken,
                        joinUser: broadcaster
                    });
                });
            };
        },
        onRoomClosed: function(room) {
            var joinButton = document.querySelector('button[data-roomToken="'+ room.roomToken +'"]');
            if(joinButton) {
                joinButton.parentNode.parentNode.parentNode.parentNode.removeChild(joinButton.parentNode.parentNode.parentNode);
            }
        },

        onVideoMessage: function(response) {
            onVideoMessage(response);
        }
    };

    function setupNewRoomButtonClickHandler() {
        btnSetupNewRoom.style.display = "none";
        var roomName = (document.getElementById('conference-name') || { }).value || 'Anonymous';
        document.getElementById('conference-name').style.display = "none";
        captureUserMedia(function() {
            conferenceUI.createRoom({
                roomName: roomName
            });
        });
    }

    function captureUserMedia(callback) {
        var video = document.createElement('video');
        video.setAttribute('width', "300px");
        video.setAttribute("autoplay", "true");
        video.setAttribute('controls', "true");
        videosContainer.insertBefore(video, videosContainer.firstChild);

        getUserMedia({
            video: video,
            onsuccess: function(stream) {
                config.attachStream = stream;
                callback && callback();

                video.setAttribute('muted', "true");
                scaleVideos();
            },
            onerror: function() {
                alert('unable to get access to your webcam');
                callback && callback();
            }
        });
    }

    conferenceUI = conference(config);

    /* UI specific */
    var videosContainer = document.getElementById('experiment') || document.body;
    var btnSetupNewRoom = document.getElementById('setup-new-room');
    btnSetupNewRoom.disabled = false;
    document.getElementById('conference-name').disabled = false;
    var roomsList = document.getElementById('rooms-list');

    if (btnSetupNewRoom) btnSetupNewRoom.onclick = setupNewRoomButtonClickHandler;

    (function() {
        var uniqueToken = document.getElementById('unique-token');
        if (uniqueToken)
            if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
            else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');
    })();

    function scaleVideos() {
        var videos = document.querySelectorAll('video'),
            length = videos.length, video;

        var minus = 130;
        var windowHeight = 700;
        var windowWidth = 600;
        var windowAspectRatio = windowWidth / windowHeight;
        var videoAspectRatio = 4 / 3;
        var blockAspectRatio;
        var tempVideoWidth = 0;
        var maxVideoWidth = 0;

        for (var i = length; i > 0; i--) {
            blockAspectRatio = i * videoAspectRatio / Math.ceil(length / i);
            if (blockAspectRatio <= windowAspectRatio) {
                tempVideoWidth = videoAspectRatio * windowHeight / Math.ceil(length / i);
            } else {
                tempVideoWidth = windowWidth / i;
            }
            if (tempVideoWidth > maxVideoWidth)
                maxVideoWidth = tempVideoWidth;
        }
        for (var j = 0; j < length; j++) {
            video = videos[j];
            if (video)
                video.width = maxVideoWidth - minus;
        }
    }

    window.onresize = scaleVideos;
});