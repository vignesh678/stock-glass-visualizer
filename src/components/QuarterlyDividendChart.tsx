
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData } from '@/data/stockData';

interface QuarterlyDividendChartProps {
  stock: StockData;
}

const QuarterlyDividendChart: React.FC<QuarterlyDividendChartProps> = ({ stock }) => {
  const hasNonZeroDividends = stock.quarterlyDividends.some(div => div.value > 0);
  
  return (
    <div className="h-full w-full p-4">
      <h3 className="text-lg font-semibold mb-4">Quarterly Dividends</h3>
      {hasNonZeroDividends ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={stock.quarterlyDividends}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
            />
            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[200px] bg-gray-50/50 rounded-lg">
          <p className="text-gray-500">No dividend data available</p>
        </div>
      )}
    </div>
  );
};

export default QuarterlyDividendChart;
