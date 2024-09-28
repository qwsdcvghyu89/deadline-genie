async function recordAndUploadAudio(uploadUrl) {
    // Check for MediaRecorder support in the browser
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaRecorder not supported on your browser. Please use a supported browser like Chrome or Firefox.');
      return;
    }
  
    try {
      // Request microphone access and create a MediaRecorder instance
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];
  
      // Event handler for data available from the recorder
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
  
      // Promise to handle the stopping of the recording
      const recordingStopped = new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          resolve(audioBlob);
        };
        mediaRecorder.onerror = event => reject(event.error);
      });
  
      // Start recording
      mediaRecorder.start();
      console.log('Recording started. Please speak into the microphone.');
  
      // Stop recording after 5 seconds (or manually call mediaRecorder.stop())
      setTimeout(() => {
        mediaRecorder.stop();
        console.log('Recording stopped.');
      }, 5000); // Change duration as needed
  
      // Wait for the recording to stop and get the audio blob
      const audioBlob = await recordingStopped;
  
      // Upload the audio file to the server
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
  
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
      console.error('Error accessing microphone or recording audio:', error);
    }
  }
  
  // Usage example:
  // Replace 'your-backend-url/upload' with the actual URL of your backend endpoint
  recordAndUploadAudio('https://your-backend-url/upload');
  