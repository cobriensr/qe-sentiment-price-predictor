import React from 'react'
import { cn, getSentimentLabel, getSentimentColor, getSentimentBgColor } from '@/lib/utils'

interface SentimentBadgeProps {
  readonly sentiment: number
  readonly size?: 'sm' | 'md' | 'lg'
  readonly showLabel?: boolean
  readonly showPercentage?: boolean
  readonly className?: string
}

export default function SentimentBadge({
  sentiment,
  size = 'md',
  showLabel = true,
  showPercentage = false,
  className
}: SentimentBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const label = getSentimentLabel(sentiment)
  const colorClass = getSentimentColor(sentiment)
  const bgClass = getSentimentBgColor(sentiment)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        sizeClasses[size],
        bgClass,
        colorClass,
        className
      )}
    >
      {showLabel && <span>{label}</span>}
      {showPercentage && (
        <span className={showLabel ? 'ml-1' : ''}>
          {(sentiment * 100).toFixed(0)}%
        </span>
      )}
    </span>
  )
}