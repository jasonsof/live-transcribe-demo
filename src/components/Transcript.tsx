import { useEffect, useRef } from "react";

export default function Transcript({ lines }: { lines: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="transcript-container"
    >
      {lines.map((line, idx) => (
        <div key={idx} className="transcript-line">
          {line}
        </div>
      ))}
    </div>
  );
}
