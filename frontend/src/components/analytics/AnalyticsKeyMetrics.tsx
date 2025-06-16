// src/components/analytics/AnalyticsKeyMetrics.tsx
import { Target, BarChart3, Award, PieChart } from 'lucide-react'
import AnalyticsKeyMetricsProps from '@/types/analyticskeymetricsprops'

export default function AnalyticsKeyMetrics({ metrics }: Readonly<AnalyticsKeyMetricsProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Model Accuracy</span>
        </div>
        <div className="text-2xl font-bold text-sentiment-positive">{metrics.modelAccuracy}%</div>
        <div className="text-sm text-sentiment-positive">
          +{metrics.accuracyChange}% vs last month
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Predictions Made</span>
        </div>
        <div className="text-2xl font-bold">{metrics.totalPredictions.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">This quarter</div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Top Sector</span>
        </div>
        <div className="text-2xl font-bold">{metrics.topSector}</div>
        <div className="text-sm text-sentiment-positive">
          {(metrics.topSectorSentiment * 100).toFixed(0)}% avg sentiment
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Coverage</span>
        </div>
        <div className="text-2xl font-bold">{metrics.companiesCovered}</div>
        <div className="text-sm text-muted-foreground">Companies tracked</div>
      </div>
    </div>
  )
}
