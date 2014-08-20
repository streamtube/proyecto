var PeerConnection = function() {
    this.pc = null;

    globals.socketCanal.on('message', function(message) {
        console.log('[PeerConnection] Received message:', message);
        if (message.type === 'offer') {
            this.SDPReceived(message);
        } else if (message.type === 'answer') {
            this.answerSDPReceived(message);
        } else if (message.type === 'candidate') {
            this.ICEReceived(message);
        } else if (message === 'bye') {
            //handleRemoteHangup();
        }
    }.bind(this));
};

PeerConnection.prototype.SDPReceived = function(message) {
    console.log("[PeerConnection] Received SDP! -> Set remote description");
    this.createPeerConnection();
    this.pc.setRemoteDescription(new RTCSessionDescription(message), this.remoteDescriptionSet.bind(this));
};

PeerConnection.prototype.remoteDescriptionSet = function() {
    console.log("[PeerConnection] Remote Description set! -> Creating answer");
    var options = { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } };
    this.pc.createAnswer(this.setLocalAndSendMessage.bind(this),
        function(error) {
            console.error(error.message);
            throw new Error(error);
        }, options);
    this.remoteDescriptionAdded = true;
};

PeerConnection.prototype.answerSDPReceived = function(message) {
    console.log("[PeerConnection] Answer SDP Received! -> Set remote description");
    this.pc.setRemoteDescription(new RTCSessionDescription(message), (function() {
        console.log("[PeerConnection] Remote Description set! -> Doing nothing");
        this.remoteDescriptionAdded = true;
    }).bind(this));
};

PeerConnection.prototype.ICEReceived = function(message) {
    if(!this.remoteDescriptionAdded) {
        console.log("[PeerConnection] ICE Received! -> Do nothing because remote description is not added");
        return;
    }

    console.log("[PeerConnection] ICE Received! -> Add candidate");
    //var params = {sdpMLineIndex: message.sdplineindex, candidate: message.candidate};
    var params = {sdpMLineIndex: message.label, candidate: message.candidate};
    this.pc.addIceCandidate(new RTCIceCandidate(params));
};


PeerConnection.prototype.createPeerConnection = function() {
    if(this.pc) {
        console.log("[PeerConnection] Ya he creado el peer connection. No lo crearé otra vez");
        return;
    }

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
    this.pc.onicecandidate = this.handleIceCandidate.bind(this);
};

PeerConnection.prototype.addStream = function(stream) {
    console.log("[PeerConnection] Añadiendo mi stream al peer connection");
    this.pc.addStream(stream);
};

PeerConnection.prototype.handleIceCandidate = function(event) {
    console.log('[PeerConnection] handleIceCandidate event: ', event);
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
    console.log("[PeerConnection] Answer created! -> set local description with this answer", sessionDescription);
    this.pc.setLocalDescription(sessionDescription);
    console.log("[PeerConnection] Local description set -> send to the other peer the answer");
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
