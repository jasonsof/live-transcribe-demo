import { useState } from 'react'

import RecordingButton from './components/RecordingButton'
import useAudioCapture from './hooks/useAudioCapture'
import './App.css'

function App() {
  const [recorderState, setRecorderState] = useState<'notready' | 'ready' | 'recording'>('notready')
  const { amplitude } = useAudioCapture(recorderState, setRecorderState)

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
