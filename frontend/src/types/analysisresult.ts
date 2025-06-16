import SentimentAnalysis from './sentimentanalysis'
import StockData from './stockdata'
import StockPrediction from './stockprediction'
import HistoricalData from './historicaldata'
import SentimentHistory from './sentimenthistory'

interface AnalysisResult {
  sentiment: SentimentAnalysis
  stock: StockData
  prediction: StockPrediction
  historicalData: HistoricalData[]
  sentimentHistory: SentimentHistory[]
}

export default AnalysisResult
