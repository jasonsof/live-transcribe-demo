let whisper = null;
let ctx = null;

importScripts('/whisper/libstream.js');

Module().then(async (instance) => {
  whisper = instance;

  try {
    const response = await fetch('/whisper/ggml-tiny.en.bin');
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    whisper.FS_createDataFile('/', 'ggml-tiny.en.bin', bytes, true, true);

    ctx = whisper.init('ggml-tiny.en.bin');
    if (!ctx) throw new Error('Whisper init failed');

    postMessage('ready');
  } catch (err) {
    postMessage({ type: 'error', error: err.message || String(err) });
  }
});

self.addEventListener('message', (e) => {
  const { type, chunk, id } = e.data;

  if (type === 'transcribe') {
    try {
      const typedChunk = new Float32Array(chunk.buffer || chunk);

      const result = whisper.set_audio(ctx, typedChunk);
      if (result !== 0) throw new Error('set_audio failed');

      const result2 = whisper.run_transcription(ctx);
      if (result2 !== 0) throw new Error('run_transcription failed');

      const transcript = whisper.get_transcribed();
      self.postMessage({ type: 'result', result: transcript, id });

    } catch (err) {
      self.postMessage({ type: 'error', error: err.message || String(err), id });
    }
  }
});
