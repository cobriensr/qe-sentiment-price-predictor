interface SentimentAnalysisFormProps {
  symbol: string
  onSymbolChange: (symbol: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export default SentimentAnalysisFormProps
