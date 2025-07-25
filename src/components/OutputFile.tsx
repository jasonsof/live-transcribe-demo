type OutputFileProps = {
  file: File | null
}

function OutputFile({ file }: OutputFileProps) {
  return (
    <div className="chunkList">
        {
          file && (
            <a
              href={URL.createObjectURL(file)}
              download={file.name}
            >
              Download Recording {file.name}
            </a>
          )
        }
    </div>
  )
}
export default OutputFile
