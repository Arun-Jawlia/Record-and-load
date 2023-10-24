const videoElement = document.getElementById('video');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const captureButton = document.getElementById('capture-button');
const canvas = document.getElementById('canvas');

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
captureButton.addEventListener('click', captureImage);

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'recorded-video.webm';
        a.textContent = 'Download Video';
        document.body.appendChild(a);
    };

    mediaRecorder.start();
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

function captureImage() {
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // You can save the captured image or display it on the page
    const image = canvas.toDataURL('image/png');
    const imgElement = new Image();
    imgElement.src = image;
    document.body.appendChild(imgElement);
}
