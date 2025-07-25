type RecordButtonProps = {
  state: string
  loading?: boolean
  onClick: () => void
  amplitude: number
}

function RecordButton({
  state,
  loading=false,
  onClick,
  amplitude
}: RecordButtonProps) {
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

  const handleClick = () => {
    if(state === "notready" || loading) return

    onClick()
  }

  return (
    <button
      className={`recordingButton ${stateClass}`}
      style={style}
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <span className="recordingButton__spinner" />}
    </button>
  )
}
export default RecordButton
