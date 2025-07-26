class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.inputSampleRate = sampleRate;
    this.targetSampleRate = 16000;
    this.resampleRatio = this.targetSampleRate / this.inputSampleRate;

    this.windowSize = 16000; // 1 second @ 16kHz
    this.hopSize = 8000;     // 50% overlap

    this._resampleBuffer = [];
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

  emitChunksIfReady() {
    while (this._resampleBuffer.length >= this.windowSize) {
      const chunk = this._resampleBuffer.slice(0, this.windowSize);
      this.port.postMessage(new Float32Array(chunk));
      this._resampleBuffer = this._resampleBuffer.slice(this.hopSize);
    }
  }
}

registerProcessor('pcm-processor', PCMProcessor);
