// src/components/portfolio/PortfolioControls.tsx
import { Search } from 'lucide-react'
import PortfolioControlsProps from '@/types/portfoliocontrolsprops'

export default function PortfolioControls({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
}: Readonly<PortfolioControlsProps>) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search holdings..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <select
        value={sortBy}
        onChange={e => onSortChange(e.target.value as any)}
        className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="value">Sort by Value</option>
        <option value="symbol">Sort by Symbol</option>
        <option value="return">Sort by Return</option>
        <option value="sentiment">Sort by Sentiment</option>
      </select>
    </div>
  )
}
