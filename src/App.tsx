import { useState, useEffect } from 'react'

import RecordingButton from './components/RecordingButton'
import useAudioCapture from './hooks/useAudioCapture'
import useWhisperModel from './hooks/useWhisperModel'
import './App.css'

function App() {
  const [recorderState, setRecorderState] = useState<'notready' | 'ready' | 'recording'>('notready')
  const { amplitude } = useAudioCapture(recorderState, setRecorderState)
  const { ready, error } = useWhisperModel()

  useEffect(() => {
    console.log("ready =", ready)
    console.log("error =", error)
  }, [ready, error])

  return (
    <div className="container">
      <RecordingButton state={recorderState} amplitude={amplitude} />
    </div>
  )
}

export default App
