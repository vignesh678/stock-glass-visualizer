
import React from 'react';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from './ui/card';

interface QuarterlyData {
  quarter: string;
  revenue: number;
  netProfit: number;
  eps: number;
}

interface QuarterlyResultsChartProps {
  data: QuarterlyData[];
}

const QuarterlyResultsChart = ({ data }: QuarterlyResultsChartProps) => {
  return (
    <Card className="p-4">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue (₹ Cr)" />
            <Bar dataKey="netProfit" fill="#82ca9d" name="Net Profit (₹ Cr)" />
            <Bar dataKey="eps" fill="#ffc658" name="EPS (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default QuarterlyResultsChart;
