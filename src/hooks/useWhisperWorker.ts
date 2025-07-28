import { useEffect, useRef, useState } from 'react';

export default function useWhisperWorker() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<number, {
    resolve: (value: string) => void,
    reject: (err: any) => void
  }>>(new Map());
  const nextId = useRef(0);

  useEffect(() => {
    const worker = new Worker('/whisperWorker.js'); 
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data === 'ready') {
        setReady(true);
      } else if (e.data?.type === 'error') {
        const id = e.data.id;
        if (id != null && pendingRequests.current.has(id)) {
          pendingRequests.current.get(id)?.reject(e.data.error);
          pendingRequests.current.delete(id);
        } else {
          setError(e.data.error);
        }
      } else if(e.data?.type === 'result') {
        const id = e.data.id;
        const result = e.data.result;

        if (pendingRequests.current.has(id)) {
          pendingRequests.current.get(id)?.resolve(result);
          pendingRequests.current.delete(id);
        }
      }
    };

    worker.onerror = (e) => {
      console.error('Worker error:', e);
      setError(e.message);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  function transcribe(chunk:Float32Array):Promise<string> {
    return new Promise((resolve, reject) => {
      const id = nextId.current++;
      pendingRequests.current.set(id, { resolve, reject });
  
      const copy = new Float32Array(chunk);
      workerRef.current?.postMessage({ type: 'transcribe', chunk: copy, id }, [copy.buffer]);
    })
  }

  return { ready, error, transcribe };
}
