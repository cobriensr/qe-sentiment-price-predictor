interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export default ApiError
