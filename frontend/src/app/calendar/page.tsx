// src/app/calendar/page.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Filter, TrendingUp, Search } from 'lucide-react'
import Navbar from '@/components/ui/NavBar'
import PageHeader from '@/components/ui/PageHeader'
import SentimentBadge from '@/components/sentiment/SentimentBadge'
import EarningsEvent from '@/types/earningsevent'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 16)) // January 16, 2025
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock earnings data for the next few weeks
  const earningsEvents: EarningsEvent[] = [
    {
      symbol: 'NFLX',
      company: 'Netflix Inc.',
      date: '2025-01-16',
      time: '4:30 PM ET',
      quarter: 'Q4 2024',
      lastSentiment: 0.72,
      expectedSentiment: 0.68,
      importance: 'high',
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      date: '2025-01-17',
      time: '5:00 PM ET',
      quarter: 'Q4 2024',
      lastSentiment: 0.65,
      expectedSentiment: 0.71,
      importance: 'high',
    },
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      date: '2025-01-30',
      time: '5:00 PM ET',
      quarter: 'Q1 2025',
      lastSentiment: 0.78,
      expectedSentiment: 0.75,
      importance: 'high',
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      date: '2025-01-29',
      time: '5:30 PM ET',
      quarter: 'Q2 2025',
      lastSentiment: 0.82,
      expectedSentiment: 0.79,
      importance: 'high',
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      date: '2025-02-04',
      time: '4:00 PM ET',
      quarter: 'Q4 2024',
      lastSentiment: 0.58,
      expectedSentiment: 0.62,
      importance: 'high',
    },
    {
      symbol: 'META',
      company: 'Meta Platforms Inc.',
      date: '2025-02-05',
      time: '4:00 PM ET',
      quarter: 'Q4 2024',
      lastSentiment: 0.45,
      expectedSentiment: 0.52,
      importance: 'medium',
    },
    {
      symbol: 'AMZN',
      company: 'Amazon.com Inc.',
      date: '2025-02-06',
      time: '4:00 PM ET',
      quarter: 'Q4 2024',
      lastSentiment: 0.71,
      expectedSentiment: 0.69,
      importance: 'high',
    },
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      date: '2025-02-20',
      time: '4:30 PM ET',
      quarter: 'Q4 2025',
      lastSentiment: 0.88,
      expectedSentiment: 0.85,
      importance: 'high',
    },
  ]

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const filterEvents = (events: EarningsEvent[]) => {
    let filtered = events

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(event => event.importance === selectedFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        event =>
          event.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const groupEventsByDate = (events: EarningsEvent[]) => {
    return events.reduce(
      (groups, event) => {
        const date = event.date
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(event)
        return groups
      },
      {} as Record<string, EarningsEvent[]>
    )
  }

  const filteredEvents = filterEvents(earningsEvents)
  const groupedEvents = groupEventsByDate(filteredEvents)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const isToday = (dateStr: string) => {
    const today = new Date().toDateString()
    const eventDate = new Date(dateStr).toDateString()
    return today === eventDate
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Earnings Calendar"
          description="Track upcoming earnings calls with sentiment-based insights and predictions"
        />

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {getMonthName(currentDate)}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search companies or symbols..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value as any)}
              className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-card rounded-lg border">
          <span className="text-sm font-medium">Priority:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Low</span>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {Object.entries(groupedEvents)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, events]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className={`text-lg font-semibold ${isToday(date) ? 'text-primary' : ''}`}>
                    {formatDate(date)}
                  </h3>
                  {isToday(date) && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      Today
                    </span>
                  )}
                </div>

                <div className="grid gap-3">
                  {events.map(event => (
                    <div
                      key={`${event.symbol}-${event.date}`}
                      className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-2 h-2 rounded-full ${getImportanceColor(event.importance)}`}
                          ></div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg">{event.symbol}</span>
                              <span className="text-muted-foreground">{event.company}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-muted-foreground">
                                {event.quarter} • {event.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {event.lastSentiment && (
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">
                                Last Sentiment
                              </div>
                              <SentimentBadge sentiment={event.lastSentiment} size="sm" />
                            </div>
                          )}

                          {event.expectedSentiment && (
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Expected</div>
                              <SentimentBadge sentiment={event.expectedSentiment} size="sm" />
                            </div>
                          )}

                          <Link
                            href={`/analyze?symbol=${event.symbol}`}
                            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm flex items-center gap-1"
                          >
                            <TrendingUp className="h-3 w-3" />
                            Analyze
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No earnings found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No earnings calls scheduled for this period.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
