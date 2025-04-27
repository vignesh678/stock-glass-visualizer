
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
import { Card } from './ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuarterlyResultsChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.quarter),
    datasets: [
      {
        label: 'Revenue (₹ Cr)',
        data: data.map(item => item.revenue),
        backgroundColor: '#8884d8',
      },
      {
        label: 'Net Profit (₹ Cr)',
        data: data.map(item => item.netProfit),
        backgroundColor: '#82ca9d',
      },
      {
        label: 'EPS (₹)',
        data: data.map(item => item.eps),
        backgroundColor: '#ffc658',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="p-4">
      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default QuarterlyResultsChart;
