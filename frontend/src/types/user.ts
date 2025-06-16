import UserPreferences from './userpreferences'

export interface User {
  id: string
  email: string
  name?: string
  preferences: UserPreferences
  createdAt: string
}

export default User
