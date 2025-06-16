interface ApiError {
  code: string
  message: string
  details?: {
    field?: string
    value?: string | number
    constraint?: string
    [key: string]: unknown
  }
}

export default ApiError
