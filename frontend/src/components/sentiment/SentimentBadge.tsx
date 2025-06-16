// src/components/sentiment/SentimentBadge.tsx
import React from 'react'
import { cn, getSentimentLabel, getSentimentColor, getSentimentBgColor } from '@/lib/utils'
import SentimentBadgeProps from '@/types/sentimentbadgeprops'

export default function SentimentBadge({
  sentiment,
  size = 'md',
  showLabel = true,
  showPercentage = false,
  className,
}: Readonly<SentimentBadgeProps>) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
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
        <span className={showLabel ? 'ml-1' : ''}>{(sentiment * 100).toFixed(0)}%</span>
      )}
    </span>
  )
}
