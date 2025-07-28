class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.inputSampleRate = sampleRate;
    this.targetSampleRate = 16000; // Whisper requires 16 kHz mono float32 audio
    this.resampleRatio = this.targetSampleRate / this.inputSampleRate;

    // amount of resampled audio (in samples) to collect before emitting a chunk
    // at 16kHz, 80000 samples = 5 seconds of audio
    this.windowSize = 80000;

    // after emitting a chunk, move this many samples forward (hop size)
    // 16000 = 1 second, so you get 2 seconds of overlap between windows
    this.hopSize = 80000; // 

    this._resampleBuffer = [];
    this.lastEmit = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const mono = this.downmixToMono(input);
    const resampled = this.linearResample(mono, this.resampleRatio);
    this._resampleBuffer.push(...resampled);

    this.emitChunksIfReady();
    return true;
  }

  downmixToMono(input) {
    const numChannels = input.length;
    const numSamples = input[0].length;
    const mono = new Float32Array(numSamples);

    if (numChannels === 1) {
      mono.set(input[0]);
    } else {
      const left = input[0];
      const right = input[1];
      for (let i = 0; i < numSamples; i++) {
        mono[i] = (left[i] + right[i]) / 2;
      }
    }

    return mono;
  }

  linearResample(input, ratio) {
    const outputLength = Math.floor(input.length * ratio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const index = i / ratio;
      const i0 = Math.floor(index);
      const i1 = Math.min(i0 + 1, input.length - 1);
      const frac = index - i0;
      output[i] = input[i0] * (1 - frac) + input[i1] * frac;
    }
    return output;
  }

  // only post new chunks once per second
  emitChunksIfReady() {
    const now = currentTime; // built-in AudioWorkletProcessor time in seconds
    if (now - this.lastEmit < 1) return; // 1s between emits

    while (this._resampleBuffer.length >= this.windowSize) {
      const chunk = this._resampleBuffer.slice(0, this.windowSize);
      const chunkArray = new Float32Array(chunk);
      this.port.postMessage(chunkArray, [chunkArray.buffer]);
            
      this._resampleBuffer = this._resampleBuffer.slice(this.hopSize);

      this.lastEmit = now;
    }
  }
}

registerProcessor('pcm-processor', PCMProcessor);
