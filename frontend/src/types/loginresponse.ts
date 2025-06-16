import User from './user'

interface LoginResponse {
  token: string
  user: User
}

export default LoginResponse
