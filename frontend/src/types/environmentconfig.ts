interface EnvironmentConfig {
  apiUrl: string
  environment: 'development' | 'staging' | 'production'
  features: {
    portfolioManagement: boolean
    realTimeData: boolean
    advancedAnalytics: boolean
  }
}

export default EnvironmentConfig
