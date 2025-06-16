// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sentiment utility functions
export function getSentimentLevel(sentiment: number): 'bearish' | 'neutral' | 'bullish' {
  if (sentiment >= 0.7) return 'bullish'
  if (sentiment >= 0.4) return 'neutral'
  return 'bearish'
}

export function getSentimentLabel(sentiment: number): string {
  const level = getSentimentLevel(sentiment)
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function getSentimentColor(sentiment: number): string {
  const level = getSentimentLevel(sentiment)
  switch (level) {
    case 'bullish':
      return 'text-sentiment-positive'
    case 'neutral':
      return 'text-sentiment-neutral'
    case 'bearish':
      return 'text-sentiment-negative'
  }
}

export function getSentimentBgColor(sentiment: number): string {
  const level = getSentimentLevel(sentiment)
  switch (level) {
    case 'bullish':
      return 'bg-sentiment-positive/10 border-sentiment-positive/20'
    case 'neutral':
      return 'bg-sentiment-neutral/10 border-sentiment-neutral/20'
    case 'bearish':
      return 'bg-sentiment-negative/10 border-sentiment-negative/20'
  }
}

// Number formatting utilities
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export function formatLargeNumber(value: number, decimals: number = 1): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(decimals)}T`
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`
  }
  return value.toFixed(decimals)
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

// Date formatting utilities
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  let options: Intl.DateTimeFormatOptions

  switch (format) {
    case 'short':
      options = { month: 'short', day: 'numeric' }
      break
    case 'medium':
      options = { month: 'short', day: 'numeric', year: 'numeric' }
      break
    case 'long':
      options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
      break
  }

  return new Intl.DateTimeFormat('en-US', options).format(dateObj)
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj)
}

export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`

  return formatDate(dateObj, 'short')
}

export function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 6 = Saturday
  const hour = now.getHours()
  const minute = now.getMinutes()
  const time = hour * 60 + minute // minutes since midnight

  // Market is closed on weekends
  if (day === 0 || day === 6) return false

  // Market hours: 9:30 AM - 4:00 PM ET
  const marketOpen = 9 * 60 + 30 // 9:30 AM
  const marketClose = 16 * 60 // 4:00 PM

  return time >= marketOpen && time < marketClose
}

// Validation utilities
export function isValidStockSymbol(symbol: string): boolean {
  return /^[A-Z]{1,5}$/.test(symbol.toUpperCase())
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0
  return ((newValue - oldValue) / oldValue) * 100
}

export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN)
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / period)
    }
  }

  return result
}

// Local storage utilities with error handling
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error)
  }
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing from localStorage key "${key}":`, error)
  }
}

// URL utilities
export function createSearchParams(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value))
  })

  return searchParams.toString()
}

// Debounce utility - FIXED
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility - FIXED
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Type guards for error handling
function hasMessage(error: unknown): error is { message: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

function hasResponseMessage(error: unknown): error is {
  response: { data: { message: string } }
} {
  return (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    typeof (error as { response: unknown }).response === 'object' &&
    (error as { response: object }).response !== null &&
    'data' in (error as { response: object }).response &&
    typeof (error as { response: { data: unknown } }).response.data === 'object' &&
    (error as { response: { data: object } }).response.data !== null &&
    'message' in (error as { response: { data: object } }).response.data &&
    typeof (error as { response: { data: { message: unknown } } }).response.data.message ===
      'string'
  )
}

// Error handling utilities - FIXED
export function handleApiError(error: unknown): string {
  if (hasResponseMessage(error)) {
    return error.response.data.message
  }

  if (hasMessage(error)) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Retry utility for failed operations
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (attempts <= 1) throw error

    await sleep(delay)
    return retry(fn, attempts - 1, delay * 2)
  }
}
