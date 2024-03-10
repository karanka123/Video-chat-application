const APP_ID = '3dc1e3a398e44027902658e361382995'
const CHANNEL = sessionStorage.getItem('roomname')
console.log(CHANNEL)
const TOKEN = sessionStorage.getItem('token')
console.log(TOKEN)
let UID = sessionStorage.getItem('uid')
console.log(UID)

let localtrack = []

let remoteuser = {}

let client = AgoraRTC.createClient({mode:'rtc', codec : 'vp8'})
let codec = async function codecfinder(){
    requiredCodec = await AgoraRTC.getSupportedCodec();
    console.log(`The required codec is `,requiredCodec)
}

async function joinChannelToClient(){
    document.getElementById('room-name').innerText = CHANNEL
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)
    await client.join(APP_ID, CHANNEL, TOKEN, UID);
    
    localtrack = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">My Name:</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                    </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localtrack[1].play(`user-${UID}`);

    await client.publish([localtrack[0], localtrack[1]]);
}

let handleUserJoined = async function(user, mediatype){
    await client.subscribe(user, mediatype);

    if(mediatype === 'video'){
        remoteuser[user.uid] = user
        let remote_userplay = document.getElementById('user-${user.uid}');
        if(remote_userplay != null){
            remote_userplay.remove;
        }
        let player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">My Name:</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
                    </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)  
    }

    if(mediatype === 'audio'){
        audioTrack.play(`user-${user.uid}`)
    }
}

let handleUserLeft = async(user) => {
    delete remoteuser[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let removechannel = async function (){
    for(let i = 0; i > localtrack.length; i++){
        localtrack[i].stop()
        localtrack[i].close()
    }

    await client.leave();
    

    window.open('/', '_self');
}

let toggleCamera = async function(event){
    if(localtrack[1].muted === true){
        await localtrack[1].setMuted(false)
        event.target.style.backgroundColor = 'white'
    }else{
        await localtrack[1].setMuted(true);
        event.target.style.backgroundColor = 'red'
    }
}

let toggleaudio = async function(event) {
    try {
        if (localtrack[0].muted === true) {
            await localtrack[0].setMuted(false); // Unmute the track
            event.target.style.backgroundColor = 'white';
        } else {
            await localtrack[0].setMuted(true); // Mute the track
            event.target.style.backgroundColor = 'red';
        }
    } catch (error) {
        console.error("Error toggling audio:", error);
    }
}

joinChannelToClient();

document.getElementById('leave-btn').addEventListener('click', removechannel)

document.getElementById('camera-btn').addEventListener('click', toggleCamera)

document.getElementById('mic-btn').addEventListener('click', toggleaudio)