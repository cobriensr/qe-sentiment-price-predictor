// src/components/analytics/AnalyticsControls.tsx
import { Filter } from 'lucide-react'
import AnalyticsControlsProps from '../../types/analyticscontrolsprops'
import { TimeRange } from '../../types/timerange'
import { Metric } from '../../types/metric'

export default function AnalyticsControls({
  timeRange,
  selectedMetric,
  onTimeRangeChange,
  onMetricChange,
}: Readonly<AnalyticsControlsProps>) {
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '1M', label: 'Last Month' },
    { value: '3M', label: 'Last 3 Months' },
    { value: '6M', label: 'Last 6 Months' },
    { value: '1Y', label: 'Last Year' },
  ]

  const metricOptions: { value: Metric; label: string }[] = [
    { value: 'sentiment', label: 'Sentiment' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'returns', label: 'Returns' },
  ]

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={timeRange}
          onChange={e => onTimeRangeChange(e.target.value as TimeRange)}
          className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {timeRangeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {metricOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onMetricChange(option.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedMetric === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
