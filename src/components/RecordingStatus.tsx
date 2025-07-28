type RecordingStatusProps = {
  state: string
  loading?: boolean
  amplitude: number
}

function RecordingStatus({
  state,
  loading=false,
  amplitude
}: RecordingStatusProps) {
  const style =
    state === 'recording'
      ? { '--amplitude-opacity': Math.max(0.2, amplitude).toString() } as React.CSSProperties
      : undefined;

  let stateClass;
  switch(state) {
    case "recording":
      stateClass = "recordingButton--recording";
      break;
    case "ready":
      stateClass = "recordingButton--ready";
      break;
    case "notready":
      stateClass = "recordingButton--error";
      break;
  }

  return (
    <div
      className={`recordingButton ${stateClass}`}
      style={style}
    >
      {loading && <span className="recordingButton__spinner" />}
    </div>
  )
}
export default RecordingStatus
