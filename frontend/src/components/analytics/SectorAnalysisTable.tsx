// src/components/analytics/SectorAnalysisTable.tsx
import SentimentBadge from '@/components/sentiment/SentimentBadge'
import SectorAnalysisTableProps from '@/types/sectoranalysistableprops'

export default function SectorAnalysisTable({ sectors }: Readonly<SectorAnalysisTableProps>) {
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">Sector Analysis</h3>
      <div className="space-y-4">
        {sectors.map(sector => (
          <div
            key={sector.sector}
            className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium">{sector.sector}</div>
                <div className="text-sm text-muted-foreground">
                  {sector.stockCount} companies • Top: {sector.topPerformer}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Sentiment</div>
                <SentimentBadge sentiment={sector.avgSentiment} size="sm" />
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Return</div>
                <div
                  className={`font-medium ${sector.avgReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}
                >
                  {sector.avgReturn >= 0 ? '+' : ''}
                  {sector.avgReturn.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Risk</div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getRiskBadgeColor(sector.riskLevel)}`}
                >
                  {sector.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
