class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const samples = input[0]; // first channel
      this.port.postMessage(samples); // send to main thread
    }
    return true; // keep processor alive
  }
}

registerProcessor('pcm-processor', PCMProcessor);
