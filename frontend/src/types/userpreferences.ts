interface UserPreferences {
  defaultPortfolio?: string
  notifications: {
    earningsReminders: boolean
    sentimentAlerts: boolean
    portfolioUpdates: boolean
  }
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  investmentStyle: 'value' | 'growth' | 'dividend' | 'mixed'
}

export default UserPreferences
