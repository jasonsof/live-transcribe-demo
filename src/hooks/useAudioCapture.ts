import { useEffect, useState } from 'react'
import { getAudioRecorder } from '../lib/mediaRecorder'
import type { Dispatch, SetStateAction } from 'react'

export default function useAudioCapture(
  recorderState: string,
  setRecorderState: Dispatch<SetStateAction<'notready' | 'ready' | 'recording'>>
) {
  const [amplitude, setAmplitude] = useState(0)

  useEffect(() => {
    const setup = async () => {
      const { audioStream } = await getAudioRecorder()
      const audioContext = new AudioContext()

      await audioContext.audioWorklet.addModule('/amplitude-processor.js');
      await audioContext.audioWorklet.addModule('/pcm-processor.js');

      const micSource = audioContext.createMediaStreamSource(audioStream)

      const gainNode = audioContext.createGain()
      gainNode.gain.value = 4.5

      const ampNode = new AudioWorkletNode(audioContext, 'amplitude-processor')
      const whisperNode = new AudioWorkletNode(audioContext, 'pcm-processor')

      whisperNode.port.onmessage = (e) => {
        const chunk = e.data as Float32Array
        // 🎯 SEND CHUNK TO WHISPER HERE
        // These are 16kHz, 1s Float32Arrays
        console.log('Chunk ready', chunk.length)
      }

      // Simple amplitude visualization
      ampNode.port.onmessage = (e) => {
        const { type, value } = e.data;
        if (type === 'rms') {
          const clamped = Math.min(1, value * 5);
          setAmplitude(clamped);
        }
      };

      micSource.connect(gainNode);
      gainNode.connect(ampNode);
      gainNode.connect(whisperNode);

      setRecorderState('recording')
    }

    if (recorderState === 'notready') {
      setup()
    }
  }, [recorderState, setRecorderState])

  return { amplitude }
}
