import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'

export default function UploadBox({ onFilesSelected }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl2 border-2 border-dashed p-12 text-center transition-colors duration-250 ${
        isDragActive
          ? 'border-primary bg-primary-soft dark:bg-primary/10'
          : 'border-border bg-surface hover:border-primary/40 dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl2 bg-primary-soft text-primary dark:bg-primary/10">
        <UploadCloud size={20} />
      </div>
      <p className="text-sm font-medium text-ink dark:text-white">
        {isDragActive ? 'Release to upload' : 'Drop files or click to select'}
      </p>
      <p className="mt-1 text-xs text-muted">
        Single, multiple, folder, and batch uploads are all supported.
      </p>
    </div>
  )
}
