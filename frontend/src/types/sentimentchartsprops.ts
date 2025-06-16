import HistoricalData from './historicaldata'
import SentimentHistory from './sentimenthistory'

interface SentimentChartsProps {
  readonly historicalData: ReadonlyArray<HistoricalData>
  readonly sentimentHistory: ReadonlyArray<SentimentHistory>
}

export default SentimentChartsProps
