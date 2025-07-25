import { useEffect, useState } from 'react'

import RecordingButton from './components/RecordingButton'
import { getAudioRecorder } from './lib/mediaRecorder'
import './App.css'

function App() {
  const [recorderState, setRecorderState] = useState<'notready' | 'ready' | 'recording'>('notready')
  const [amplitude, setAmplitude] = useState(0);

  useEffect(() => {
    const setupMediaRecorder = async () => {
      const { audioStream } = await getAudioRecorder()

      const audioContext = new AudioContext();
      // Load the worklet from public folder
      await audioContext.audioWorklet.addModule('/pcm-processor.js');

      // input source
      const micSource = audioContext.createMediaStreamSource(audioStream);

      // Create a GainNode to amplify the signal
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 4.5; // 2x to 4x is usually safe
      
      // custom processor to get the raw samples
      const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');

      // Get audio samples from worklet
      workletNode.port.onmessage = (event) => {
        const samples = event.data;
        const rms = Math.sqrt(samples.reduce((sum: number, x: number) => sum + x * x, 0) / samples.length); // root mean squared is a good representation of amplitude or power of a fluctuating signal like audio
        const clamped = Math.min(1, rms * 5); // Normalize for visual range
        setAmplitude(clamped);
      };

      micSource.connect(gainNode).connect(workletNode);

      setRecorderState('recording')
    }
    setupMediaRecorder()
  }, [])

  const toggleRecording = () => {
    if (recorderState === 'ready') {
      setRecorderState('recording')
    } else if (recorderState === 'recording') {
      setRecorderState('ready')
    }
  }

  return (
    <div className="container">
      <RecordingButton state={recorderState} onClick={toggleRecording} amplitude={amplitude} />
    </div>
  )
}

export default App
