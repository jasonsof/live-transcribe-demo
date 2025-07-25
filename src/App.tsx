import { useEffect, useRef, useState } from 'react'

import RecordingButton from './components/RecordingButton'
import OutputFile from './components/OutputFile'
import { getCurrentTimeString } from './lib/timeHelper'
import { getAudioRecorder } from './lib/mediaRecorder'
import './App.css'

function App() {
  const [recorderState, setRecorderState] = useState<'notready' | 'ready' | 'recording'>('notready')
  const [outputFile, setOutputFile] = useState<File | null>(null)

  const audioChunksRef = useRef<Blob[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const setupMediaRecorder = async () => {
      const { mediaRecorder, audioStream } = await getAudioRecorder()
      mediaRecorderRef.current = mediaRecorder
      audioStreamRef.current = audioStream
      setRecorderState('ready')

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const fullRecording = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const webmFile = new File([fullRecording], `recorded-audio-${getCurrentTimeString()}.webm`, { type: 'audio/webm' })
        audioChunksRef.current = []

        setOutputFile(webmFile)
      }
    }
    setupMediaRecorder()

    return () => {
      audioStreamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const toggleRecording = () => {
    if (!mediaRecorderRef.current) return

    if (recorderState === 'ready') {
      setRecorderState('recording')
      mediaRecorderRef.current.start(1000)
    } else if (recorderState === 'recording') {
      setRecorderState('ready')
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="container">
      <RecordingButton state={recorderState} onClick={toggleRecording} />
      <OutputFile file={outputFile} />
    </div>
  )
}

export default App
