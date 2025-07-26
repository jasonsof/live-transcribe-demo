class AmplitudeProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const channel = input[0]; // assume mono or take first channel
    const rms = Math.sqrt(channel.reduce((sum, x) => sum + x * x, 0) / channel.length);

    this.port.postMessage({ type: 'rms', value: rms });
    return true;
  }
}

registerProcessor('amplitude-processor', AmplitudeProcessor);
