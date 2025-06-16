// src/components/portfolio/PortfolioPhaseNotice.tsx
import { AlertTriangle } from 'lucide-react'

export default function PortfolioPhaseNotice() {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 text-blue-800">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">Phase 3 Feature Preview</span>
      </div>
      <p className="text-sm text-blue-700 mt-1">
        Portfolio management will be available in Phase 3 with user authentication and real portfolio tracking. 
        This is a preview with sample data.
      </p>
    </div>
  )
}