// src/app/analyze/page.tsx
import { Suspense } from 'react'
import AnalyzePageContent from '../../components/AnalyzePageContent'

// Loading component
function AnalyzePageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stock Sentiment Analysis</h1>
        <p className="text-muted-foreground">
          Analyze earnings call sentiment to predict quarterly stock performance
        </p>
      </div>
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function AnalyzePage() {
  return (
    <Suspense fallback={<AnalyzePageLoading />}>
      <AnalyzePageContent />
    </Suspense>
  )
}