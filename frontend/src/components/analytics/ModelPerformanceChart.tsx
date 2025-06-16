// src/components/analytics/ModelPerformanceChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ModelPerformanceChartProps from '@/types/modelperformancechartprops'

export default function ModelPerformanceChart({ data }: Readonly<ModelPerformanceChartProps>) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">Model Accuracy Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[...data]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[70, 95]} />
            <Tooltip formatter={(value: number) => [`${value}%`, 'Accuracy']} />
            <Bar dataKey="accuracy" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
