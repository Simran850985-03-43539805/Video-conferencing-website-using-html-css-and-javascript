let localStream;
let remoteStream;
let peerConnection;

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');

startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = event => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send the ICE candidate to the remote peer
            console.log('New ICE candidate', event.candidate);
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the remote peer
    console.log('Offer:', offer);

    // Simulate receiving an answer (in a real app, you would get this from the remote peer)
    const answer = await peerConnection.createAnswer();
    await peerConnection.setRemoteDescription(answer);

    startCallButton.disabled = true;
    endCallButton.disabled = false;
}

function endCall() {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    remoteStream.getTracks().forEach(track => track.stop());

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    startCallButton.disabled = false;
    endCallButton.disabled = true;
}
