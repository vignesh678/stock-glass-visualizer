
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card } from './ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const YearlyHighLowChart = ({ stock }) => {
  const chartData = {
    labels: stock.yearlyHighLow.map(item => item.year),
    datasets: [
      {
        label: 'High',
        data: stock.yearlyHighLow.map(item => item.high),
        borderColor: 'rgba(255, 87, 87, 1)',
        backgroundColor: 'rgba(255, 87, 87, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Low',
        data: stock.yearlyHighLow.map(item => item.low),
        borderColor: 'rgba(87, 199, 255, 1)',
        backgroundColor: 'rgba(87, 199, 255, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="h-full w-full p-4">
      <h3 className="text-lg font-semibold mb-4">Yearly High/Low Prices</h3>
      <div className="h-[220px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default YearlyHighLowChart;
