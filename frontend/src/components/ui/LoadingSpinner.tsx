// src/components/ui/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingSpinnerProps from '@/types/loadingspinnerprops'

export default function LoadingSpinner({
  size = 'md',
  text,
  className,
}: Readonly<LoadingSpinnerProps>) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && <p className={cn('text-muted-foreground', textSizeClasses[size])}>{text}</p>}
      </div>
    </div>
  )
}
