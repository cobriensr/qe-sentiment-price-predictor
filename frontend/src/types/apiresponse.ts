interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export default ApiResponse
