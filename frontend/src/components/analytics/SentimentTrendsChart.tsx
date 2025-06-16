// src/components/analytics/SentimentTrendsChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import SentimentTrendsChartProps from '@/types/sentimenttrendschartprops'

export default function SentimentTrendsChart({ data }: Readonly<SentimentTrendsChartProps>) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">Sentiment Trends by Sector</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...data]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 1]} />
            <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Sentiment']} />
            <Line
              type="monotone"
              dataKey="overall"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Overall"
            />
            <Line
              type="monotone"
              dataKey="tech"
              stroke="#10B981"
              strokeWidth={2}
              name="Technology"
            />
            <Line
              type="monotone"
              dataKey="finance"
              stroke="#EF4444"
              strokeWidth={2}
              name="Financial"
            />
            <Line
              type="monotone"
              dataKey="healthcare"
              stroke="#8B5CF6"
              strokeWidth={2}
              name="Healthcare"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
