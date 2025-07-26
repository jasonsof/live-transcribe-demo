import { useEffect, useRef, useState } from 'react'
import { getAudioRecorder } from '../lib/mediaRecorder'
import type { Dispatch, SetStateAction } from 'react';

export default function useAudioCapture(
    recorderState: string,
    setRecorderState: Dispatch<SetStateAction<'notready' | 'ready' | 'recording'>>
  ) {
  const [amplitude, setAmplitude] = useState(0)
  const bufferRef = useRef<Float32Array | null>(null)
  const writeIndexRef = useRef(0)

  const handSamples = (samples:Float32Array, bufferSize:number) => {
    const rms = Math.sqrt(samples.reduce((sum, x) => sum + x * x, 0) / samples.length)
    const clamped = Math.min(1, rms * 5)
    setAmplitude(clamped)

    if (!bufferRef.current) return
    const buffer = bufferRef.current
    const remaining = buffer.length - writeIndexRef.current

    if (samples.length <= remaining) {
      buffer.set(samples, writeIndexRef.current)
      writeIndexRef.current += samples.length
    } else {
      buffer.set(samples.subarray(0, remaining), writeIndexRef.current)
      console.log('fullChunk ready', buffer.length)

      // TODO: send buffer to Whisper

      // Start fresh
      bufferRef.current = new Float32Array(bufferSize)
      writeIndexRef.current = 0
      bufferRef.current.set(samples.subarray(remaining), 0)
      writeIndexRef.current += samples.length - remaining
    }
  }

  useEffect(() => {
    const setup = async () => {
      const { audioStream } = await getAudioRecorder()
      const audioContext = new AudioContext()
      const sampleRate = audioContext.sampleRate
      const bufferSize = sampleRate * 1
      bufferRef.current = new Float32Array(bufferSize)
      writeIndexRef.current = 0

      await audioContext.audioWorklet.addModule('/pcm-processor.js')
      const micSource = audioContext.createMediaStreamSource(audioStream)
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 4.5
      const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor')

      workletNode.port.onmessage = (e) => {
        handSamples(e.data as Float32Array, bufferSize)
      }

      micSource.connect(gainNode).connect(workletNode)
      setRecorderState('recording')
    }

    if (recorderState === 'notready') {
      setup()
    }
  }, [recorderState, setRecorderState])

  return { amplitude }
}
