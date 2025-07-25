export const getAudioRecorder = async () => {
  const audioStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  })
  const mediaRecorder = new MediaRecorder(audioStream)

  return { mediaRecorder, audioStream }
}