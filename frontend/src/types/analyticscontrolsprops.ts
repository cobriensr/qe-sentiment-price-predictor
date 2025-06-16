import { TimeRange } from './timerange'
import { Metric } from './metric'

interface AnalyticsControlsProps {
  readonly timeRange: TimeRange
  readonly selectedMetric: Metric
  readonly onTimeRangeChange: (range: TimeRange) => void
  readonly onMetricChange: (metric: Metric) => void
}

export default AnalyticsControlsProps
