// src/components/ui/ErrorDisplay.tsx
import { AlertCircle } from 'lucide-react'
import ErrorDisplayProps from '@/types/errordisplayprops'

export default function ErrorDisplay({ error, className = '' }: Readonly<ErrorDisplayProps>) {
  return (
    <div
      className={`p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 ${className}`}
    >
      <AlertCircle className="h-4 w-4" />
      {error}
    </div>
  )
}
