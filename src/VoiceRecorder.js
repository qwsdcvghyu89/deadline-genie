// VoiceRecorder.js
import React, { useState, useEffect, useRef } from 'react';

const VoiceRecorder = () => {
  // State for recording and audio playback
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Request access to microphone on component mount
    const initRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        // Handle data availability
        mediaRecorderRef.current.ondataavailable = event => {
          audioChunksRef.current.push(event.data);
        };

        // Handle stopping of the recording
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          audioChunksRef.current = []; // Clear chunks for next recording
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initRecorder();
  }, []);

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    audioChunksRef.current = []; // Clear previous data
    mediaRecorderRef.current.start();
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {audioURL && (
        <div>
          <h2>Recorded Audio</h2>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;