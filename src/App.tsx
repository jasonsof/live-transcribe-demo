import { useState, useEffect, useRef } from 'react'

import RecordingStatus from './components/RecordingStatus'
import Transcript from './components/Transcript'
import useAudioCapture from './hooks/useAudioCapture'
import useWhisperWorker from './hooks/useWhisperWorker'
import './App.css'

function App() {
  const [recorderState, setRecorderState] = useState<'notready' | 'ready' | 'recording'>('notready')
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const { amplitude, latestChunk, isSilent } = useAudioCapture(recorderState, setRecorderState)
  const { ready, transcribe } = useWhisperWorker()
  const transcriptionQueueRef = useRef<Promise<any> | null>(null);
  const lastTranscriptRef = useRef<string>("");
  const recordingReadyState = !ready ? 'notready' : recorderState;

  useEffect(() => {
    if (!latestChunk || !ready) return;
    if (isSilent(latestChunk)) return
    if (transcriptionQueueRef.current) return; // already processing
  
    const task = (async () => {
      try {
        const result =  await transcribe(latestChunk);

        if (result && result.trim() !== lastTranscriptRef.current.trim()) {
          setTranscriptLines(prev => [result.trim(), ...prev]);
          lastTranscriptRef.current = result.trim();
        }
      } catch (err) {
        console.error("Transcription failed:", err);
      }
    })();

    transcriptionQueueRef.current = task;

    task.finally(() => {
      transcriptionQueueRef.current = null;
    });
  }, [latestChunk, isSilent, ready, transcribe]);

  return (
    <div className="container">
      <RecordingStatus state={recordingReadyState} amplitude={amplitude} />
      <Transcript lines={transcriptLines} />
    </div>
  )
}

export default App
