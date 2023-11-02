// All Elements
const camera = document.getElementById("camera");
const startCameraButton = document.getElementById("startCamera");
const stopCameraButton = document.getElementById("stopCamera");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const downloadVideoLink = document.getElementById("download-video");
const timerDisplay = document.getElementById("timer");
const audioToggle = document.getElementById("audio-toggle");
const floatingDownload = document.querySelector(".floating-download");
const closeFloatingDownload = document.querySelector(".uil-multiply");
// const canvas = document.getElementById("canvas");
// const downloadLink = document.getElementById("download-link");
// const captureImageButton = document.getElementById("capture-button");

let mediaStream;
let mediaRecorder;
let recordedChunks = [];
let timerInterval;
let recording = false;
let seconds = 0;
// let capturedImage = null;
let audioEnable = true;

// captureImageButton.style.display = "none";
startRecordingButton.style.display = "none";
stopRecordingButton.style.display = "none";
downloadVideoLink.style.display = "none";
stopCameraButton.disabled = true;
audioToggle.style.display = "none";

// Function to start the camera
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: audioEnable,
    });
    mediaStream = stream;
    camera.srcObject = stream;
    // captureImageButton.style.display = "block";
    startRecordingButton.style.display = "flex";
    stopRecordingButton.style.display = "flex";
    stopCameraButton.disabled = false;
    startCameraButton.disabled = true;
    audioToggle.style.display = "block";
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
};

// Function to stop the camera
const stopCamera = async () => {
  // captureImageButton.style.display = "none";
  startRecordingButton.style.display = "none";
  stopRecordingButton.style.display = "none";
  camera.srcObject = null;
  startCameraButton.disabled = false;
  stopCameraButton.disabled = true;
  downloadVideoLink.style.display = "none";
  timerDisplay.innerText = "00:00:00";
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
      setTimeout(() => {
        alert("Your video is in progress...");
        floatingDownload.classList.add("show");
        downloadVideoLink.style.display = "flex";
        downloadVideoLink.href = videoUrl;
        downloadVideoLink.download = `${Date.now()}recorded-video.mp4`;
        recording = false;
      }, 1000);
    };
    mediaRecorder.start();
    recording = true;
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
    stopCameraButton.disabled = true;
    // captureImageButton.style.display = "none";
    startTimer();
  } else {
    alert("Error accessing the camera:");
  }
};

// Function to stop video recording
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    clearInterval(timerInterval);
    timerInterval = null;
    recording = false;
    stopRecordingButton.disabled = true;
    startRecordingButton.disabled = false;
    stopCameraButton.disabled = false;
    // captureImageButton.style.display = "block";
  }
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

      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      timerDisplay.innerText = formattedTime;
    }, 1000);
  }
};

const toggleAudio = () => {
  console.log(audioToggle.innerText);
  if (audioEnable) {
    audioToggle.innerText = "Mic on";
    audioEnable = false;
  } else {
    audioToggle.innerText = "Mic off";
    audioEnable = true;
  }
};

// Function to stop the timer
// const stopTimer = () => {
//   clearInterval(timerInterval);
// };

// Function to capture an image
// const captureImage = () => {
//   const context = canvas.getContext("2d");
//   context.drawImage(camera, 0, 0, canvas.width, canvas.height);

//   if (capturedImage) {
//     URL.revokeObjectURL(capturedImage);
//   }

//   canvas.toBlob((blob) => {
//     console.log(blob);
//     const url = URL.createObjectURL(blob);
//     downloadLink.href = url;
//     downloadLink.style.display = "inline";
//     downloadLink.download = ` ${Date.now()}  `;
//   });
// };

// captureImageButton.addEventListener("click", captureImage);

// Function invocation
startCameraButton.addEventListener("click", startCamera);
stopCameraButton.addEventListener("click", stopCamera);
startRecordingButton.addEventListener("click", startRecording);
stopRecordingButton.addEventListener("click", stopRecording);
audioToggle.addEventListener("click", toggleAudio);
closeFloatingDownload.addEventListener("click", () => {
  console.log("Hidden");
  floatingDownload.classList.remove("show");
});
