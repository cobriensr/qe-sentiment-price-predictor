interface SentimentBadgeProps {
  readonly sentiment: number
  readonly size?: 'sm' | 'md' | 'lg'
  readonly showLabel?: boolean
  readonly showPercentage?: boolean
  readonly className?: string
}

export default SentimentBadgeProps
