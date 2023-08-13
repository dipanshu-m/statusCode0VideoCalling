
let spoken = 'en'
function getTranslationFromEnglishToHindi(sourcetext) {
    payload = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": "en",
                        "targetLanguage": "hi"
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": sourcetext
                }
            ]
        }
    }
    console.log(payload);
    return axios.post(uri,
        payload, {
        headers: {
            Authorization: AuthorizationToken,
            'Content-Type': 'application/json',
            'ulcaApiKey': ulcaApiKey,
            'userId': userId
        }
    }).then((res) => {
        // console.log(res.data.pipelineResponse[0].output[0].target)
        return res.data.pipelineResponse[0].output[0].target;
    })
}


function getTranslationFromHindiToEnglish(sourcetext) {
    payload = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": "hi",
                        "targetLanguage": "en"
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": sourcetext
                }
            ]
        }
    }
    console.log(payload);
    return axios.post(uri,
        payload, {
        headers: {
            Authorization: AuthorizationToken,
            'Content-Type': 'application/json',
            'ulcaApiKey': ulcaApiKey,
            'userId': userId
        }
    }).then((res) => {
        // console.log(res.data.pipelineResponse[0].output[0].target)
        return res.data.pipelineResponse[0].output[0].target;
    })
}

function speakInHindi(event) {
    // Create a new SpeechSynthesisUtterance object
    let utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'hi-IN';
    // Get the text from the text area
    let text = event;
    // Set the text and voice of the utterance
    utterance.text = text;
    // let voices = window.speechSynthesis.getVoices();
    // console.log(voices);
    // utterance.voice = window.speechSynthesis.getVoices()[10];
    console.log(utterance);
    // utterance.voice =
    // Speak the utterance
    window.speechSynthesis.speak(utterance);
}


// function speakInEnglish(event) {
//     // Create a new SpeechSynthesisUtterance object
//     let utterance = new SpeechSynthesisUtterance();
//     utterance.lang = 'en-US';
//     // Get the text from the text area
//     let text = event;
//     // Set the text and voice of the utterance
//     utterance.text = text;
//     // let voices = window.speechSynthesis.getVoices();
//     // console.log(voices);
//     // utterance.voice = window.speechSynthesis.getVoices()[10];
//     console.log(utterance);
//     // utterance.voice =
//     // Speak the utterance
//     window.speechSynthesis.speak(utterance);
// }


const videoGrid = document.getElementById("video_grid");
const muteBtn = document.getElementById("muteBtn")
const cameraoff = document.getElementById("cameraoff")
const selectCam = document.getElementById("selectCam")
const selectMic = document.getElementById("selectMic")
const screenShare = document.getElementById("screenShare")
// const selectTagLanguage = document.getElementById('language');

// socket init 
const socket = io();


// webkit speech recognition
var speechRecognition = new webkitSpeechRecognition;
speechRecognition.lang = "en-US";
let total_result = '';
speechRecognition.continuous = true;
speechRecognition.start();

speechRecognition.onresult = (event) => {
    console.log(event.results[event.resultIndex][0].transcript);
    socket.emit('recieve_message', (event.results[event.resultIndex][0].transcript));
    console.log('said: ', event.results[event.resultIndex][0].transcript);

    total_result += '\n' + event.results[event.resultIndex][0].transcript;
}

// selectTagLanguage.addEventListener('change', (ev) => {
//     console.log('tag changed!');
//     var value = selectTagLanguage.options[selectTagLanguage.selectedIndex].value;
//     console.log(value);
//     switch (value) {
//         case 'Speak in Hindi':
//             // receiveLang = 'en'
//             spoken = 'hi'

//             delete speechRecognition;
//             speechRecognition = new webkitSpeechRecognition;
//             speechRecognition.lang = "hi-IN";

//             speechRecognition.continuous = true;
//             speechRecognition.start();

//             speechRecognition.onresult = (event) => {
//                 console.log(event.results[event.resultIndex][0].transcript);
//                 socket.emit('recieve_message', (event.results[event.resultIndex][0].transcript));
//                 console.log('said: ', event.results[event.resultIndex][0].transcript);

//                 total_result += '\n' + event.results[event.resultIndex][0].transcript;
//             }
//             break;
//         case 'Speak in English':
//             // receiveLang = 'en'
//             spoken = 'en'

//             delete speechRecognition;
//             speechRecognition = new webkitSpeechRecognition;
//             speechRecognition.lang = "en-US";

//             speechRecognition.continuous = true;
//             speechRecognition.start();
//             speechRecognition.onresult = (event) => {
//                 console.log(event.results[event.resultIndex][0].transcript);
//                 socket.emit('recieve_message', (event.results[event.resultIndex][0].transcript));
//                 console.log('said: ', event.results[event.resultIndex][0].transcript);

//                 total_result += '\n' + event.results[event.resultIndex][0].transcript;
//             }
//             break;
//         default:
//             console.log('wahts ti=his err');
//             break;
//     }
// })


let mediaStream;
let mute = false;
let camera = true;
let currentCam;
let RTC;

// sound mute handler
muteBtn.addEventListener("click", (e) => {
    if (mute) {
        mute = false;
        muteBtn.textContent = "Mute yourself";
        mediaStream.getAudioTracks()
            .forEach(track => {
                track.enabled = true;
            })
        speechRecognition.start();
    } else {
        mute = true;
        speechRecognition.stop();
        // console.log(speechRecognition);
        muteBtn.textContent = "Unmute yourself";
        mediaStream.getAudioTracks()
            .forEach(track => {
                track.enabled = false;
            })
    }


})



cameraoff.addEventListener('click', () => {
    if (camera) {
        cameraoff.textContent = "Turn on camera";
        camera = false;
        mediaStream.getVideoTracks()
            .forEach(track => {
                track.enabled = false;
            })

    } else {
        cameraoff.textContent = "Turn off camera";
        camera = true;
        mediaStream.getVideoTracks()
            .forEach(track => {
                track.enabled = true;
            })
    }
})


// getting the medias
async function getMedia(cameraId, micId) {


    currentCam = cameraId === null ? currentCam : cameraId;

    const initialConstraits = {
        video: true,
        audio: true
    }

    const preferredCameraConstraints = {
        video: {
            deviceId: cameraId
        },
        audio: true,
    }

    const videoOption = currentCam ? {
        deviceId: currentCam
    } : true;

    const preferredMicConstraints = {
        video: videoOption,
        audio: {
            deviceId: micId
        },
    }

    try {


        mediaStream = await window.navigator.mediaDevices.getUserMedia(cameraId || micId ? cameraId ? preferredCameraConstraints : preferredMicConstraints : initialConstraits)
        // send joining notification

        displayMedia()
        getAllCameras()
        getAllMics()
        makeWebRTCConnection();

        // room joining event
        socket.emit('joinRoom', roomId)

    } catch (error) {
        console.log(error);
    }


}
getMedia()




async function getScreenMedia() {
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true,
        });
        displayMedia()
    } catch (error) {
        console.log(error);
    }
}


screenShare.addEventListener('click', getScreenMedia)


// display media
function displayMedia() {
    const video = document.createElement('video');

    // prevent our voice from getting heart
    video.muted = true;

    video.srcObject = mediaStream; //first cam
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.appendChild(video)

}

// get all cameras
async function getAllCameras() {
    const currentCamera = mediaStream.getVideoTracks()[0];
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    selectCam.innerHTML = ''
    allDevices.forEach(device => {

        if (device.kind === "videoinput") {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label;
            option.selected = device.label === currentCamera.label ? true : false;
            selectCam.appendChild(option)
        }
    })
}




// get all mics
async function getAllMics() {
    const currentMic = mediaStream.getAudioTracks()[0];
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    selectMic.innerHTML = ''
    allDevices.forEach(device => {

        if (device.kind === "audioinput") {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label;
            option.selected = device.label === currentMic.label ? true : false;
            selectMic.appendChild(option)
        }
    })
}



// select a specific camera
selectCam.addEventListener('input', (e) => {
    const cameraId = e.target.value;
    getMedia(cameraId)

})

// select a specific camera
selectMic.addEventListener('input', (e) => {
    const micId = e.target.value;
    getMedia(null, micId)
})







/// socket

socket.on("newJoining", () => {
    makeAOffer()
})


// make WebRTC connection
function makeWebRTCConnection() {
    // rtc init
    RTC = new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun1.l.google.com:19302'
            },
            {
                urls: 'stun:stun3.l.google.com:19302'
            },
            {
                urls: 'stun:stun4.l.google.com:19302'
            }
        ]
    });

    // add media tracks to RTC
    mediaStream.getTracks()
        .forEach(track => {
            RTC.addTrack(track, mediaStream)
        })

    // send ICE candidate
    RTC.addEventListener('icecandidate', (data) => {
        socket.emit("sendIceCandidate", data.candidate, roomId);
    })

    // send ICE candidate
    RTC.addEventListener('addstream', (data) => {
        const videoTag = document.createElement('video');
        console.log(data.stream);
        videoTag.srcObject = data.stream; //one to fiddle with
        //-----------------
        videoTag.muted = true;
        socket.on('recieve_message', async (data) => {
            speakInHindi(await getTranslationFromEnglishToHindi(data));
            // console.log(data);
            // speakInHindi(await getTranslationFromEnglishToHindi(data));
            // if (spoken == 'hi')
            //     speakInHindi(await getTranslationFromEnglishToHindi(data));
            // else speakInEnglish(await getTranslationFromHindiToEnglish(data));
            // console.log(await getTranslation(data));
        })

        //-----------------


        videoTag.addEventListener('loadedmetadata', () => {
            videoTag.play()
        })

        videoGrid.appendChild(videoTag)
    })

}



// make a offer
async function makeAOffer() {
    const offer = await RTC.createOffer();
    RTC.setLocalDescription(offer)
    // send the offer 
    socket.emit("sendTheOffer", offer, roomId)
}

// receive offer
socket.on("receiveOffer", async (offer) => {
    RTC.setRemoteDescription(offer);
    const answer = await RTC.createAnswer();
    RTC.setLocalDescription(answer);

    // send the answer
    socket.emit("sendTheAnswer", answer, roomId)
})


// receive answer
socket.on("receiveAnswer", (answer) => {
    RTC.setRemoteDescription(answer)
})


// receive answer
socket.on("receiveCandidate", (candidate) => {
    RTC.addIceCandidate(candidate)
})












/*
    1. RTC connection initialization after media stream ready!
    2. add media tracks to RTC
*/
// websocket.close();