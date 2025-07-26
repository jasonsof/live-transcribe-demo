# 🎙️ Audio Transcribe Demo (with Web Audio API & AudioWorklet)

This is a browser-based prototype that captures live microphone audio using the Web Audio API and streams raw PCM data via an `AudioWorklet`. The goal is to prepare for real-time transcription using a model like Whisper, without relying on `MediaRecorder` or transcoding tools like FFmpeg.

> 🚀 [Live Demo](https://audio-capture-demo.vercel.app/) — *(hosted version)*

## 🚀 Features

- ✅ Microphone permission and access using `navigator.mediaDevices.getUserMedia`
- ✅ Modular audio graph with `AudioContext` and `AudioWorkletNode`
- ✅ Custom AudioWorklet processor that emits raw `Float32Array` PCM buffers
- ✅ Animated recording button with live amplitude feedback
- ✅ Clean React-based UI, ready for expansion

## 📦 Tech Stack

- React
- TypeScript
- Web Audio API
- AudioWorklet
- Vite (for development)

## 🧠 Why use Web Audio API over MediaRecorder?

- MediaRecorder gives you encoded chunks (e.g. WebM/Opus) — not ideal for live transcription
- Web Audio API gives **low-level raw PCM** samples
- No FFmpeg needed — just pure audio data
- Enables **real-time**, **streamed** transcription workflows

## 🧪 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
