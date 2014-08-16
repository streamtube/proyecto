var PeerConnection = function() {
    this.pc = null;
};

PeerConnection.prototype.createPeerConnection = function() {
    try {
        var pc_config = webrtcDetectedBrowser === 'firefox' ?
        {'iceServers':[{'url':'stun:23.21.150.121'}]} : // number IP
        {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

        this.pc = new RTCPeerConnection(pc_config);
        this.pc.onicecandidate = this.handleIceCandidate.bind(this);
        console.log('Created RTCPeerConnnection \n');
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }

    this.pc.onaddstream = this.handleRemoteStreamAdded.bind(this);
    this.pc.onremovestream = this.handleRemoteStreamRemoved.bind(this);

    globals.socketCanal.on('message', function(message) {
        console.log('Received message:', message);
        if (message.type === 'offer') {
            this.pc.setRemoteDescription(new RTCSessionDescription(message));
            this.pc.createAnswer(this.setLocalAndSendMessage.bind(this));
        } else if (message.type === 'answer') {
            this.pc.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate') {
            var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,candidate:message.candidate});
            this.pc.addIceCandidate(candidate);
        } else if (message === 'bye') {
            //handleRemoteHangup();
        }
    }.bind(this));

};

PeerConnection.prototype.addStream = function(stream) {
    this.pc.addStream(stream);
};

PeerConnection.prototype.handleIceCandidate = function(event) {
    console.log('handleIceCandidate event: ', event);
    if (event.candidate) {
        globals.socketCanal.emit('message', {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate});
    } else {
        console.log('End of candidates.');
    }
};

PeerConnection.prototype.handleRemoteStreamAdded = function(event) {
    console.log('Remote stream added.');
    // reattachMediaStream(miniVideo, localVideo);
    var remoteVideo = new Video();
    remoteVideo.cargarVideo(event.stream);
    //  waitForRemoteVideo();
};

PeerConnection.prototype.handleRemoteStreamRemoved = function(event) {
    console.log('Remote stream removed. Event: ', event);
};

PeerConnection.prototype.doCall = function() {
    console.log('Sending offer to peer');
    this.pc.createOffer(this.setLocalAndSendMessage.bind(this),
        function(error) {
            console.error(error);
        }
    );
};

PeerConnection.prototype.setLocalAndSendMessage = function(sessionDescription) {
    // Set Opus as the preferred codec in SDP if Opus is present.
    sessionDescription.sdp = this.preferOpus(sessionDescription.sdp);
    this.pc.setLocalDescription(sessionDescription);
    globals.socketCanal.emit('message', sessionDescription);
};

PeerConnection.prototype.preferOpus = function(sdp) {
    var sdpLines = sdp.split('\r\n');
    var mLineIndex;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
            mLineIndex = i;
            break;
        }
    }
    if (mLineIndex === null) {
        return sdp;
    }

    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('opus/48000') !== -1) {
            var opusPayload = this.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
            if (opusPayload) {
                sdpLines[mLineIndex] = this.setDefaultCodec(sdpLines[mLineIndex], opusPayload);
            }
            break;
        }
    }

    // Remove CN in m line and sdp.
    sdpLines = this.removeCN(sdpLines, mLineIndex);

    sdp = sdpLines.join('\r\n');
    return sdp;
};
// Strip CN from sdp before CN constraints is ready.
PeerConnection.prototype.removeCN = function(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    // Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length-1; i >= 0; i--) {
        var payload = this.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
        if (payload) {
            var cnPos = mLineElements.indexOf(payload);
            if (cnPos !== -1) {
                // Remove CN payload from m line.
                mLineElements.splice(cnPos, 1);
            }
            // Remove CN line in sdp
            sdpLines.splice(i, 1);
        }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
};

// Set the selected codec to the first in m line.
PeerConnection.prototype.setDefaultCodec = function (mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
        if (index === 3) { // Format of media starts from the fourth.
            newLine[index++] = payload; // Put target payload to the first.
        }
        if (elements[i] !== payload) {
            newLine[index++] = elements[i];
        }
    }
    return newLine.join(' ');
};

PeerConnection.prototype.extractSdp = function(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
};
