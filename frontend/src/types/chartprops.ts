import ChartDataPoint from './chartdatapoint'
import MultiSeriesChartData from './multiserieschartdata'

interface ChartProps {
  data: ChartDataPoint[] | MultiSeriesChartData[]
  height?: number
  type?: 'line' | 'bar' | 'area'
  colors?: string[]
}

export default ChartProps
