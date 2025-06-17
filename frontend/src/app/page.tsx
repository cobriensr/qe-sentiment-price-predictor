// src/app/page.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, TrendingUp, BarChart3, Calendar, ArrowRight } from 'lucide-react'
import NavBar from '../components/ui/NavBar'

export default function HomePage() {
  const [searchSymbol, setSearchSymbol] = useState('')

  const handleQuickAnalyze = (symbol: string) => {
    window.location.href = `/analyze?symbol=${symbol}`
  }

  const recentAnalyses = [
    { symbol: 'AAPL', sentiment: 78, prediction: '+12%', date: '2025-01-15' },
    { symbol: 'MSFT', sentiment: 65, prediction: '+8%', date: '2025-01-14' },
    { symbol: 'GOOGL', sentiment: 42, prediction: '-3%', date: '2025-01-13' },
    { symbol: 'TSLA', sentiment: 89, prediction: '+18%', date: '2025-01-12' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Use the NavBar component instead of inline navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Predict Stock Movements with Earnings Sentiment
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Analyze quarterly earnings calls with machine learning to predict long-term stock
              performance. Get insights beyond the immediate market reaction.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={searchSymbol}
                  onChange={e => setSearchSymbol(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring shadow-lg"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchSymbol.trim()) {
                      handleQuickAnalyze(searchSymbol.trim())
                    }
                  }}
                />
              </div>
              <button
                onClick={() => searchSymbol.trim() && handleQuickAnalyze(searchSymbol.trim())}
                disabled={!searchSymbol.trim()}
                className="w-full mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Analyze
              </button>
            </div>

            {/* Quick Try Examples */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="text-sm text-muted-foreground">Try:</span>
              {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'].map(symbol => (
                <button
                  key={symbol}
                  onClick={() => handleQuickAnalyze(symbol)}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-t border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Earnings Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Public Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">Q4 2024</div>
              <div className="text-sm text-muted-foreground">Latest Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12">
              Our machine learning platform analyzes earnings call sentiment to predict quarterly
              stock performance.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sentiment Analysis</h3>
                <p className="text-muted-foreground">
                  Analyze earnings call transcripts to gauge management sentiment and predict stock
                  movements.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Price Prediction</h3>
                <p className="text-muted-foreground">
                  Machine learning models predict stock performance over quarterly periods based on
                  sentiment.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Earnings Calendar</h3>
                <p className="text-muted-foreground">
                  Track upcoming earnings with sentiment-based insights and historical performance
                  data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Analyses */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Recent Analyses</h2>
            <Link
              href="/analyze"
              className="text-primary hover:text-primary/80 flex items-center gap-2 font-medium"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAnalyses.map(analysis => (
              <div
                key={analysis.symbol}
                className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{analysis.symbol}</h3>
                  <div className="text-xs text-muted-foreground">{analysis.date}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sentiment</span>
                    <span
                      className={`text-sm font-medium ${
                        analysis.sentiment >= 70
                          ? 'text-sentiment-positive'
                          : analysis.sentiment >= 40
                            ? 'text-sentiment-neutral'
                            : 'text-sentiment-negative'
                      }`}
                    >
                      {analysis.sentiment}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">90-day prediction</span>
                    <span
                      className={`text-sm font-medium ${
                        analysis.prediction.startsWith('+')
                          ? 'text-sentiment-positive'
                          : 'text-sentiment-negative'
                      }`}
                    >
                      {analysis.prediction}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of investors using sentiment analysis to make better investment
            decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="px-8 py-4 bg-background text-foreground rounded-xl hover:bg-background/90 transition-colors font-semibold"
            >
              Start Analyzing
            </Link>
            <Link
              href="/calendar"
              className="px-8 py-4 border border-primary-foreground/20 text-primary-foreground rounded-xl hover:bg-primary-foreground/10 transition-colors font-semibold"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              Built with{' '}
              <Link href="https://nextjs.org" className="text-primary hover:underline">
                Next.js
              </Link>{' '}
              and{' '}
              <Link href="https://aws.amazon.com" className="text-primary hover:underline">
                AWS
              </Link>
              . Data powered by{' '}
              <Link href="#" className="text-primary hover:underline">
                Alpha Vantage
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}