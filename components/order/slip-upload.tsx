'use client'

import { useRef, useState } from 'react'
import { ImageUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Reads the payment slip into a data URL. When Supabase Storage is connected,
// this can be swapped to upload the file and return a public URL instead.
export function SlipUpload({
  value,
  onChange,
}: {
  value: string | null
  onChange: (dataUrl: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  function handleFile(file: File | undefined) {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold">Upload payment slip</p>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value || '/placeholder.svg'} alt="Payment slip preview" className="max-h-64 w-full object-contain bg-secondary" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove slip"
            className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-4 py-8 text-center transition-colors hover:bg-secondary',
          )}
        >
          <ImageUp className="size-7 text-muted-foreground" />
          <span className="text-sm font-medium">Tap to upload slip</span>
          <span className="text-xs text-muted-foreground">PNG or JPG, up to 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  )
}
