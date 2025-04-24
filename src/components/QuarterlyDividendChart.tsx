
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { StockData } from '@/data/stockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface QuarterlyDividendChartProps {
  stock: StockData;
}

const QuarterlyDividendChart: React.FC<QuarterlyDividendChartProps> = ({ stock }) => {
  const hasNonZeroDividends = stock.quarterlyDividends.some(div => div.value > 0);
  
  const chartData = {
    labels: stock.quarterlyDividends.map(d => d.quarter),
    datasets: [
      {
        label: 'Quarterly Dividends',
        data: stock.quarterlyDividends.map(d => d.value),
        backgroundColor: 'rgba(136, 132, 216, 0.6)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-full w-full p-4">
      <h3 className="text-lg font-semibold mb-4">Quarterly Dividends</h3>
      {hasNonZeroDividends ? (
        <div className="h-[200px]">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px] bg-gray-50/50 rounded-lg">
          <p className="text-gray-500">No dividend data available</p>
        </div>
      )}
    </div>
  );
};

export default QuarterlyDividendChart;
