import { useEffect, useState, useRef } from 'react';

export default function useWhisperModel() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadModel = async () => {
      try {
        const whisper = (window as any).Module;
        if (!whisper) {
          throw new Error('Whisper module not found');
        }

        // Fetch model file from public folder
        const response = await fetch('/whisper/ggml-tiny.en.bin');
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        // Write to Emscripten FS
        whisper.FS_createDataFile('/', 'ggml-tiny.en.bin', bytes, true, true);

        // Init whisper
        const ctx = whisper.init('ggml-tiny.en.bin');
        if (ctx === 0) {
          throw new Error('Failed to initialize whisper');
        }

        console.log('✅ Whisper ready');
        setReady(true);
      } catch (err: any) {
        console.error('Whisper load failed:', err);
        setError(err.message);
      }
    };

    loadModel();
  }, []);

  return { ready, error };
}
