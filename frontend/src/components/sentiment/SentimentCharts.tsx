// src/components/sentiment/SentimentCharts.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import SentimentChartsProps from '../../types/sentimentchartsprops'

export default function SentimentCharts({
  historicalData,
  sentimentHistory,
}: Readonly<SentimentChartsProps>) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Historical Price & Sentiment */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...historicalData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="price" />
              <YAxis yAxisId="sentiment" orientation="right" domain={[0, 1]} />
              <Tooltip />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Stock Price ($)"
              />
              <Line
                yAxisId="sentiment"
                type="monotone"
                dataKey="sentiment"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Sentiment Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Accuracy */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Model Accuracy</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...sentimentHistory]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="actualReturn" fill="#3B82F6" name="Actual Return (%)" />
              <Bar dataKey="predictedReturn" fill="#8B5CF6" name="Predicted Return (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
