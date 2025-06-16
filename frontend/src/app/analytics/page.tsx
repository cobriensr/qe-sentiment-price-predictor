// src/app/analytics/page.tsx (Refactored)
'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/NavBar'
import AnalyticsPageHeader from '@/components/analytics/AnalyticsPageHeader'
import AnalyticsPhaseNotice from '@/components/analytics/AnalyticsPhaseNotice'
import AnalyticsKeyMetrics from '@/components/analytics/AnalyticsKeyMetrics'
import AnalyticsControls from '@/components/analytics/AnalyticsControls'
import SentimentTrendsChart from '@/components/analytics/SentimentTrendsChart'
import ModelPerformanceChart from '@/components/analytics/ModelPerformanceChart'
import SectorDistributionChart from '@/components/analytics/SectorDistributionChart'
import SectorAnalysisTable from '@/components/analytics/SectorAnalysisTable'
import MarketInsights from '@/components/analytics/MarketInsights'
import { TimeRange } from '@/types/timerange'
import { Metric } from '@/types/metric'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('3M')
  const [selectedMetric, setSelectedMetric] = useState<Metric>('sentiment')

  // Mock data - move to hooks in future
  const keyMetrics = {
    modelAccuracy: 86.4,
    accuracyChange: 2.1,
    totalPredictions: 1847,
    topSector: 'Technology',
    topSectorSentiment: 0.72,
    companiesCovered: 149,
  }

  const sectorAnalysis = [
    {
      sector: 'Technology',
      avgSentiment: 0.72,
      stockCount: 45,
      avgReturn: 12.3,
      riskLevel: 'medium' as const,
      topPerformer: 'NVDA',
    },
    {
      sector: 'Healthcare',
      avgSentiment: 0.68,
      stockCount: 23,
      avgReturn: 8.7,
      riskLevel: 'low' as const,
      topPerformer: 'JNJ',
    },
    {
      sector: 'Financial',
      avgSentiment: 0.45,
      stockCount: 34,
      avgReturn: -2.1,
      riskLevel: 'high' as const,
      topPerformer: 'JPM',
    },
    {
      sector: 'Energy',
      avgSentiment: 0.52,
      stockCount: 18,
      avgReturn: 15.6,
      riskLevel: 'high' as const,
      topPerformer: 'XOM',
    },
    {
      sector: 'Consumer',
      avgSentiment: 0.61,
      stockCount: 29,
      avgReturn: 5.4,
      riskLevel: 'medium' as const,
      topPerformer: 'AMZN',
    },
  ]

  const modelPerformance = [
    { month: 'Aug 2024', accuracy: 82, predictions: 156, correctPredictions: 128 },
    { month: 'Sep 2024', accuracy: 85, predictions: 189, correctPredictions: 161 },
    { month: 'Oct 2024', accuracy: 87, predictions: 203, correctPredictions: 177 },
    { month: 'Nov 2024', accuracy: 84, predictions: 178, correctPredictions: 149 },
    { month: 'Dec 2024', accuracy: 89, predictions: 234, correctPredictions: 208 },
    { month: 'Jan 2025', accuracy: 86, predictions: 167, correctPredictions: 144 },
  ]

  const sentimentTrend = [
    { month: 'Aug', overall: 0.65, tech: 0.72, finance: 0.48, healthcare: 0.71 },
    { month: 'Sep', overall: 0.68, tech: 0.75, finance: 0.52, healthcare: 0.69 },
    { month: 'Oct', overall: 0.63, tech: 0.69, finance: 0.45, healthcare: 0.72 },
    { month: 'Nov', overall: 0.67, tech: 0.74, finance: 0.49, healthcare: 0.68 },
    { month: 'Dec', overall: 0.71, tech: 0.78, finance: 0.53, healthcare: 0.73 },
    { month: 'Jan', overall: 0.69, tech: 0.72, finance: 0.45, healthcare: 0.68 },
  ]

  const marketInsights = [
    {
      title: 'AI Sector Showing Strong Sentiment',
      description:
        'Technology companies with AI focus showing 15% higher sentiment scores than sector average.',
      impact: 'positive' as const,
      confidence: 0.87,
    },
    {
      title: 'Banking Sector Under Pressure',
      description:
        'Financial sector sentiment declining due to interest rate concerns and regulatory changes.',
      impact: 'negative' as const,
      confidence: 0.82,
    },
    {
      title: 'Healthcare Stability',
      description: 'Healthcare sector maintaining consistent sentiment levels with low volatility.',
      impact: 'neutral' as const,
      confidence: 0.79,
    },
  ]

  const pieChartData = sectorAnalysis.map(sector => ({
    name: sector.sector,
    value: sector.stockCount,
    sentiment: sector.avgSentiment,
  }))

  const handleRefresh = () => {
    console.log('Refreshing analytics data...')
  }

  const handleExport = () => {
    console.log('Exporting analytics report...')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <AnalyticsPageHeader onRefresh={handleRefresh} onExport={handleExport} />

        <AnalyticsPhaseNotice />

        <AnalyticsKeyMetrics metrics={keyMetrics} />

        <AnalyticsControls
          timeRange={timeRange}
          selectedMetric={selectedMetric}
          onTimeRangeChange={setTimeRange}
          onMetricChange={setSelectedMetric}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SentimentTrendsChart data={sentimentTrend} />
          <ModelPerformanceChart data={modelPerformance} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <SectorDistributionChart data={pieChartData} />
          <div className="lg:col-span-2">
            <SectorAnalysisTable sectors={sectorAnalysis} />
          </div>
        </div>

        <MarketInsights insights={marketInsights} />
      </div>
    </div>
  )
}
