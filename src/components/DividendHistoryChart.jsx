
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

const DividendHistoryChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.year),
    datasets: [
      {
        label: 'Dividend Amount (₹)',
        data: data.map(item => item.amount),
        borderColor: '#8884d8',
        backgroundColor: '#8884d8',
        yAxisID: 'y',
      },
      {
        label: 'Yield (%)',
        data: data.map(item => item.yieldPercentage),
        borderColor: '#82ca9d',
        backgroundColor: '#82ca9d',
        yAxisID: 'y1',
      }
    ]
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
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Dividend Amount (₹)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Yield (%)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Card className="p-4">
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default DividendHistoryChart;
