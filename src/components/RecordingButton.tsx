type RecordButtonProps = {
  state: string
  loading?: boolean
  onClick: () => void
}

function RecordButton({
  state,
  loading=false,
  onClick
}: RecordButtonProps) {
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
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <span className="recordingButton__spinner" />}
    </button>
  )
}
export default RecordButton
