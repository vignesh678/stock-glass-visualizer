
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DividendChartProps {
  dividendData: {
    year: number;
    amount: number;
    yieldPercentage: number;
  }[];
}

const DividendChart: React.FC<DividendChartProps> = ({ dividendData }) => {
  const chartData = {
    labels: dividendData.map((item) => item.year.toString()),
    datasets: [
      {
        label: 'Dividend Amount (₹)',
        data: dividendData.map((item) => item.amount),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Yearly Dividend Distribution',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const yield_value = dividendData[index].yieldPercentage;
            return [
              `Amount: ₹${context.raw.toFixed(2)}`,
              `Yield: ${yield_value.toFixed(2)}%`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DividendChart;
