# 🎙️ Whisper Web Transcriber (Client-Only, Real-Time Demo)

This is a fully client-side prototype that captures live microphone audio, processes it with the Web Audio API, and transcribes it in near real-time using a WebAssembly build of [Whisper](https://github.com/ggerganov/whisper.cpp) — **entirely in the browser**, with **no server-side components or third-party services**.

> 🔒 **Privacy-first**: No audio is ever uploaded — all processing happens locally on your machine.
> 🚀 [Live Demo](https://audio-capture-demo.vercel.app/) — *(hosted version)*

## ✅ Features

- 🎤 Microphone access using `navigator.mediaDevices.getUserMedia`
- 🔊 Custom `AudioWorklet` emits raw `Float32Array` PCM chunks
- 🧠 Transcription powered by Whisper.cpp compiled to WebAssembly (WASM)
- ⚡ Web Worker used to offload Whisper and keep UI responsive
- 📉 Silence detection to avoid unnecessary transcription work
- 🎚️ Animated amplitude meter and responsive UI
- 🔁 Streaming effect with scrollable transcript (latest at top)

## Motivation

Most real-time transcription demos:
- Send your voice to an external server or API
- Use encoded audio (like WebM or Opus), introducing latency or decoding steps
- Aren’t private or work offline

This project is:
- **Privacy-preserving**: Audio stays on your machine
- **Offline-capable**: Works even without an internet connection (after first load)
- **Low-latency**: Streams short chunks to Whisper every second
- **Transparent**: You can inspect, fork, and modify everything

## 🧪 Local Development

Due to the use of `SharedArrayBuffer` (required by Emscripten + WASM threading), this app **must be served over HTTPS** — even locally.

```bash
npm install
./setup-dev.sh   # sets up HTTPS certificates
npm run dev
```

⚠️ Known Limitations
- Only supports English transcription (ggml-tiny.en.bin)
- Transcripts update roughly every second
- Requires modern browsers (Chromium-based recommended)
- WASM/Whisper can be CPU-intensive — not ideal on low-powered devices
- No streaming context across segments — some repetition may occur

📄 See [Build Notes](docs/build-notes.md) for Whisper.cpp customization and build steps.
