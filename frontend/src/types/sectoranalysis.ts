interface SectorAnalysis {
  sector: string
  avgSentiment: number
  stockCount: number
  avgReturn: number
  riskLevel: 'low' | 'medium' | 'high'
  topPerformer: string
}

export default SectorAnalysis
