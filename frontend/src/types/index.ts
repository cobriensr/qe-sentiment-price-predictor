// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Sentiment Analysis Types
export interface SentimentAnalysis {
  symbol: string
  sentiment: number
  confidence: number
  earningsDate: string
  analysisDate: string
  transcript?: string
  keyPhrases?: string[]
}

// Stock Data Types
export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  lastUpdate: string
}

// Prediction Types
export interface StockPrediction {
  symbol: string
  prediction: string
  predictionValue: number
  confidence: number
  timeframe: number // days
  targetDate: string
  factors?: string[]
}

// Historical Data Types
export interface HistoricalData {
  date: string
  price: number
  volume: number
  sentiment?: number
}

export interface SentimentHistory {
  quarter: string
  sentiment: number
  actualReturn: number
  predictedReturn: number
  accuracy?: number
}

// Combined Analysis Result
export interface AnalysisResult {
  sentiment: SentimentAnalysis
  stock: StockData
  prediction: StockPrediction
  historicalData: HistoricalData[]
  sentimentHistory: SentimentHistory[]
}

// Earnings Calendar Types
export interface EarningsEvent {
  symbol: string
  companyName: string
  date: string
  time: 'AMC' | 'BMO' | 'TBD' // After Market Close, Before Market Open, To Be Determined
  estimatedEPS?: number
  actualEPS?: number
  surprise?: number
  sentiment?: number
  analyzed: boolean
}

export interface EarningsCalendar {
  date: string
  events: EarningsEvent[]
}

// Portfolio Types
export interface PortfolioHolding {
  symbol: string
  shares: number
  avgCost: number
  currentPrice: number
  marketValue: number
  gainLoss: number
  gainLossPercent: number
  sentiment?: number
  lastAnalyzed?: string
}

export interface Portfolio {
  id: string
  name: string
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: PortfolioHolding[]
  createdAt: string
  updatedAt: string
}

// User Types
export interface User {
  id: string
  email: string
  name?: string
  preferences: UserPreferences
  createdAt: string
}

export interface UserPreferences {
  defaultPortfolio?: string
  notifications: {
    earningsReminders: boolean
    sentimentAlerts: boolean
    portfolioUpdates: boolean
  }
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  investmentStyle: 'value' | 'growth' | 'dividend' | 'mixed'
}

// API Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Chart Data Types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MultiSeriesChartData {
  date: string
  [key: string]: string | number
}

// Search Types
export interface SearchResult {
  symbol: string
  name: string
  exchange: string
  type: 'stock' | 'etf' | 'index'
  lastPrice?: number
  marketCap?: number
}

// Notification Types
export interface Notification {
  id: string
  type: 'earnings' | 'sentiment' | 'portfolio' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Form Types
export interface AnalysisForm {
  symbol: string
}

export interface PortfolioForm {
  name: string
  holdings: {
    symbol: string
    shares: number
    avgCost: number
  }[]
}

// Utility Types
export type SentimentLevel = 'bearish' | 'neutral' | 'bullish'
export type PredictionDirection = 'up' | 'down' | 'sideways'
export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'

// Component Props Types
export interface SentimentBadgeProps {
  sentiment: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export interface StockCardProps {
  symbol: string
  price: number
  change: number
  sentiment?: number
  onClick?: () => void
}

export interface ChartProps {
  data: ChartDataPoint[] | MultiSeriesChartData[]
  height?: number
  type?: 'line' | 'bar' | 'area'
  colors?: string[]
}

// Environment Variables
export interface EnvironmentConfig {
  apiUrl: string
  environment: 'development' | 'staging' | 'production'
  features: {
    portfolioManagement: boolean
    realTimeData: boolean
    advancedAnalytics: boolean
  }
}
