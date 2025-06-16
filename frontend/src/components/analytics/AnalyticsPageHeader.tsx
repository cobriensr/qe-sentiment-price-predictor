// src/components/analytics/AnalyticsPageHeader.tsx
import { RefreshCw, Download } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import AnalyticsPageHeaderProps from '../../types/analyticspageheaderprops'

export default function AnalyticsPageHeader({
  onRefresh,
  onExport,
}: Readonly<AnalyticsPageHeaderProps>) {
  return (
    <div className="flex justify-between items-start mb-8">
      <PageHeader
        title="Advanced Analytics"
        description="Comprehensive market intelligence and model performance insights"
      />
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 border border-input rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>
    </div>
  )
}
