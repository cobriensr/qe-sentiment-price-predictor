// src/components/analytics/AnalyticsPhaseNotice.tsx
import { AlertTriangle } from 'lucide-react'

export default function AnalyticsPhaseNotice() {
  return (
    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-center gap-2 text-purple-800">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">Phase 4 Feature Preview</span>
      </div>
      <p className="text-sm text-purple-700 mt-1">
        Advanced analytics and business intelligence features will be available in Phase 4. This
        preview shows comprehensive market analysis capabilities.
      </p>
    </div>
  )
}
