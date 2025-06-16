// src/components/portfolio/PortfolioPageHeader.tsx
import { Plus } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import PortfolioPageHeaderProps from '@/types/portfoliopageheaderprops'

export default function PortfolioPageHeader({
  onAddHolding,
  onAnalyzeAll,
}: Readonly<PortfolioPageHeaderProps>) {
  return (
    <div className="flex justify-between items-start mb-8">
      <PageHeader
        title="Portfolio Analysis"
        description="Track your holdings with sentiment-based insights and performance metrics"
      />
      <div className="flex gap-3">
        <button
          onClick={onAddHolding}
          className="px-4 py-2 border border-input rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Holding
        </button>
        <button
          onClick={onAnalyzeAll}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Analyze All
        </button>
      </div>
    </div>
  )
}
