import { useEffect, useState } from 'react'
import { getAudioRecorder } from '../lib/mediaRecorder'
import type { Dispatch, SetStateAction } from 'react'

export default function useAudioCapture(
  recorderState: string,
  setRecorderState: Dispatch<SetStateAction<'notready' | 'ready' | 'recording'>>
) {
  const [amplitude, setAmplitude] = useState(0)
  const [latestChunk, setLatestChunk] = useState<Float32Array | null>(null)

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
        // these are 16kHz, 1s Float32Arrays
        setLatestChunk(chunk)
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
      micSource.connect(whisperNode);

      setRecorderState('recording')
    }

    if (recorderState === 'notready') {
      setup()
    }
  }, [recorderState, setRecorderState])

  function isSilent(chunk: Float32Array, rmsThreshold = 0.002): boolean {
    const sumSquares = chunk.reduce((sum, value) => sum + value * value, 0);
    const rms = Math.sqrt(sumSquares / chunk.length);
    return rms < rmsThreshold;
  }

  return { amplitude, latestChunk, isSilent }
}
