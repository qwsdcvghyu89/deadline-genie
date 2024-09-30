let mediaRecorder;
let audioChunks = [];

// Function to start recording
async function startRecording() {
  // Check for MediaRecorder support in the browser
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('MediaRecorder not supported on your browser. Please use a supported browser like Chrome or Firefox.');
    return;
  }

  try {
    // Request microphone access and create a MediaRecorder instance
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = []; // Reset the audio chunks

    // Collect audio data in chunks
    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    // Start recording
    mediaRecorder.start();
    console.log('Recording started. Please speak into the microphone.');
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

// Function to stop recording and upload the audio
async function stopRecording(uploadUrl) {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') {
    console.error('Recording has not started or has already stopped.');
    return;
  }

  // Stop the recording
  mediaRecorder.stop();
  console.log('Recording stopped.');

  // Wait for the recording to complete
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

    // Upload the audio file to the server
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Audio uploaded successfully.');
      } else {
        console.error('Failed to upload audio.');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };
}

// Example Usage:
// Call startRecording() to start the recording process
// Call stopRecording('https://your-backend-url/upload') to stop recording and upload
