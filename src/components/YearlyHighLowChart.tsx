
import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockData } from '@/data/stockData';

interface YearlyHighLowChartProps {
  stock: StockData;
}

const YearlyHighLowChart: React.FC<YearlyHighLowChartProps> = ({ stock }) => {
  // Transform data to include the range as a bar
  const chartData = stock.yearlyHighLow.map(item => ({
    year: item.year,
    high: item.high,
    low: item.low,
    range: item.high - item.low
  }));

  return (
    <div className="h-full w-full p-4">
      <h3 className="text-lg font-semibold mb-4">Yearly High/Low Prices</h3>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }} 
          />
          <Legend />
          <Bar dataKey="range" name="Price Range" fill="#8884d850" barSize={20} />
          <Line type="monotone" dataKey="high" name="High" stroke="#ff5757" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="low" name="Low" stroke="#57c7ff" strokeWidth={2} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyHighLowChart;
