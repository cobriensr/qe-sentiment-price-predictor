import axios, { AxiosInstance, AxiosResponse } from 'axios'

import ApiResponse from '@/types/apiresponse'
import SentimentAnalysis from '@/types/sentimentanalysis'
import StockData from '@/types/stockdata'
import StockPrediction from '@/types/stockprediction'
import AnalysisResult from '@/types/analysisresult'
import EarningsCalendar from '@/types/earningscalendar'

// API Client Configuration
class ApiClient {
  private readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add authentication token if available
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error instanceof Error ? error : new Error(error))
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      error => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - clear auth token
          this.clearAuthToken()
          // Optionally redirect to login
        }

        return Promise.reject(error instanceof Error ? error : new Error(error))
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  }

  private clearAuthToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  }

  // Health check
  async healthCheck(): Promise<{ status: string; environment: string }> {
    const response = await this.client.get('/health')
    return response.data
  }

  // Sentiment Analysis
  async analyzeSentiment(data: {
    symbol: string
    transcript?: string
  }): Promise<ApiResponse<SentimentAnalysis>> {
    const response = await this.client.post('/sentiment', data)
    return response.data
  }

  // Stock Data
  async getStockData(symbol: string): Promise<ApiResponse<StockData>> {
    const response = await this.client.get(`/stock/${symbol}`)
    return response.data
  }

  // Stock Prediction
  async getPrediction(data: {
    symbol: string
    sentiment: number
    timeframe?: number
  }): Promise<ApiResponse<StockPrediction>> {
    const response = await this.client.post('/prediction', data)
    return response.data
  }

  // Combined Analysis (Phase 1 main endpoint)
  async analyzeStock(symbol: string): Promise<ApiResponse<AnalysisResult>> {
    try {
      // For now, we'll make individual calls and combine them
      // Later this can be optimized to a single endpoint
      const [sentimentRes, stockRes] = await Promise.all([
        this.analyzeSentiment({ symbol }),
        this.getStockData(symbol),
      ])

      if (!sentimentRes.success || !stockRes.success) {
        return {
          success: false,
          error: sentimentRes.error ?? stockRes.error ?? 'Analysis failed',
        }
      }

      // Get prediction based on sentiment
      const predictionRes = await this.getPrediction({
        symbol,
        sentiment: sentimentRes.data!.sentiment,
      })

      if (!predictionRes.success) {
        return {
          success: false,
          error: predictionRes.error ?? 'Prediction failed',
        }
      }

      // Mock historical data for now - replace with actual API call
      const historicalData = [
        { date: '2024-01', price: 150, volume: 1000000, sentiment: 0.6 },
        { date: '2024-04', price: 165, volume: 1200000, sentiment: 0.7 },
        { date: '2024-07', price: 170, volume: 1100000, sentiment: 0.8 },
        { date: '2024-10', price: 180, volume: 1300000, sentiment: 0.75 },
        { date: '2025-01', price: 185, volume: 1250000, sentiment: sentimentRes.data!.sentiment },
      ]

      const sentimentHistory = [
        { quarter: 'Q1 2024', sentiment: 0.6, actualReturn: 10.0, predictedReturn: 8.5 },
        { quarter: 'Q2 2024', sentiment: 0.7, actualReturn: 2.9, predictedReturn: 4.2 },
        { quarter: 'Q3 2024', sentiment: 0.8, actualReturn: 5.9, predictedReturn: 6.1 },
        { quarter: 'Q4 2024', sentiment: 0.75, actualReturn: 8.8, predictedReturn: 9.2 },
      ]

      return {
        success: true,
        data: {
          sentiment: sentimentRes.data!,
          stock: stockRes.data!,
          prediction: predictionRes.data!,
          historicalData,
          sentimentHistory,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message ?? error.message ?? 'Analysis failed',
      }
    }
  }

  // Search stocks
  async searchStocks(query: string): Promise<
    ApiResponse<
      Array<{
        symbol: string
        name: string
        exchange: string
      }>
    >
  > {
    try {
      // For now, return mock data - replace with actual search endpoint
      const mockResults = [
        { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
        { symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ' },
      ].filter(
        stock =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ??
          stock.name.toLowerCase().includes(query.toLowerCase())
      )

      return {
        success: true,
        data: mockResults,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message ?? error.message ?? 'Search failed',
      }
    }
  }

  // Earnings Calendar (Phase 2)
  async getEarningsCalendar(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<EarningsCalendar[]>> {
    const response = await this.client.get('/calendar', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  }

  // Portfolio Management (Phase 3)
  async getPortfolios(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get('/portfolios')
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message ?? error.message ?? 'Failed to fetch portfolios',
      }
    }
  }

  async createPortfolio(portfolio: {
    name: string
    holdings: Array<{ symbol: string; shares: number; avgCost: number }>
  }): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/portfolios', portfolio)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message ?? error.message ?? 'Failed to create portfolio',
      }
    }
  }

  // User Authentication (Phase 3)
  async login(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await this.client.post('/auth/login', credentials)
      const { token } = response.data.data
      this.setAuthToken(token)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message ?? error.message ?? 'Login failed',
      }
    }
  }

  async logout(): Promise<void> {
    this.clearAuthToken()
    // Optionally call logout endpoint
    try {
      await this.client.post('/auth/logout')
    } catch (error) {
      // Log logout errors for debugging
      console.error('Logout error:', error)
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/auth/me')
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message ?? error.message ?? 'Failed to get user',
      }
    }
  }
}

// Create and export singleton instance
const apiClient = new ApiClient()
export default apiClient

// Export specific methods for easier imports
export const {
  healthCheck,
  analyzeSentiment,
  getStockData,
  getPrediction,
  analyzeStock,
  searchStocks,
  getEarningsCalendar,
  getPortfolios,
  createPortfolio,
  login,
  logout,
  getCurrentUser,
} = apiClient
