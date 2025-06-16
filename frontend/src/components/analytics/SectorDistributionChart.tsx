// src/components/analytics/SectorDistributionChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import SectorDistributionChartProps from '../../types/sectordistributionchartprops'

export default function SectorDistributionChart({ data }: Readonly<SectorDistributionChartProps>) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">Sector Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={[...data]} cx="50%" cy="50%" outerRadius={80} dataKey="value">
              {data.map((_, index) => (
                <Cell
                  key={`sector-${data[index]?.name || index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
