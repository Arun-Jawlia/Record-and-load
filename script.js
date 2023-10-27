// Get HTML elements
const camera = document.getElementById("camera");
const startCameraButton = document.getElementById("startCamera");
const stopCameraButton = document.getElementById("stopCamera");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const captureImageButton = document.getElementById("capture-button");
const downloadLink = document.getElementById("download-link");
const downloadVideoLink = document.getElementById("download-video");
const canvas = document.getElementById("canvas");
const timerDisplay = document.getElementById('timer')

let mediaStream;
let mediaRecorder;
let recordedChunks = [];
let capturedImage = null;
let timerInterval;
let recording = false;
let seconds = 0
captureImageButton.style.display = "none";
startRecordingButton.style.display = "none";
stopRecordingButton.style.display = "none";
downloadVideoLink.style.display = "none";
stopCameraButton.disabled = true

// Function to start the camera
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    mediaStream = stream;
    camera.srcObject = stream;
    captureImageButton.style.display = "block";
    startRecordingButton.style.display = "block";
    stopRecordingButton.style.display = "block";
    stopCameraButton.disabled = false
    startCameraButton.disabled = true
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
};
const stopCamera = async () => {
  captureImageButton.style.display = "none";
  startRecordingButton.style.display = "none";
  stopRecordingButton.style.display = "none";
  camera.srcObject = null;
  startCameraButton.disabled = false;
  stopCameraButton.disabled = true
  downloadVideoLink.style.display = "none";
};

startCameraButton.addEventListener("click", startCamera);
stopCameraButton.addEventListener("click", stopCamera);

// Function to start video recording
const startRecording = () => {
  if (mediaStream && !recording) {
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(blob);
      downloadVideoLink.style.display = "block";
      downloadVideoLink.href = videoUrl;
      downloadVideoLink.download = `${Date.now()}recorded-video.mp4`;
      recording = false;
    };
    mediaRecorder.start();
    recording = true;
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
    captureImageButton.style.display = "none";
    startTimer();
  } else {
    alert("Error accessing the camera:");
  }
};

startRecordingButton.addEventListener("click", startRecording);

// Function to stop video recording
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    clearInterval(timerInterval)
    timerInterval = null
    recording = false
    stopRecordingButton.disabled = true;
    startRecordingButton.disabled = false;
    captureImageButton.style.display = "block";
  }
};

stopRecordingButton.addEventListener("click", stopRecording);

// Function to update and display the timer
const updateTimerDisplay = (seconds) => {
  // const timerElement = document.getElementById("timer");
  timerElement.textContent = `Recording time: ${seconds} seconds`;
};

// Function to start a timer
const startTimer = () => {
  if (!timerInterval) {
    let hours = 0;
    let minutes = 0;
    seconds = 0;

    timerInterval = setInterval(() => {
        seconds++;
        
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        if (minutes === 60) {
            minutes = 0;
            hours++;
        }

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        timerDisplay.innerText = formattedTime;
    }, 1000);
}

  // timerInterval = setInterval(() => {
  //   seconds++;
  //   updateTimerDisplay(seconds);
  //   console.log(`Recording time: ${seconds} 
  //   seconds`);
  // }, 1000);
};

// Function to stop the timer
// const stopTimer = () => {
//   clearInterval(timerInterval);
// };

// Function to capture an image
const captureImage = () => {
  const context = canvas.getContext("2d");
  context.drawImage(camera, 0, 0, canvas.width, canvas.height);

  if (capturedImage) {
    URL.revokeObjectURL(capturedImage);
  }

  canvas.toBlob((blob) => {
    console.log(blob);
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = "inline";
    downloadLink.download = ` ${Date.now()}  `;
  });
};

captureImageButton.addEventListener("click", captureImage);
