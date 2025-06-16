interface Notification {
  id: string
  type: 'earnings' | 'sentiment' | 'portfolio' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export default Notification
