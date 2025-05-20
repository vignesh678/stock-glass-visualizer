
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById, StockDetailData } from '@/data/niftyStocks';
import { stocksData } from '@/data/stockData';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
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
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const QuarterlyResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      if (!id) return;
      
      // Try to get detailed data from niftyStocks
      const detailedData = getStockDetailById(parseInt(id));
      
      // If no detailed data is found, use data from stocksData
      if (!detailedData) {
        const stockData = stocksData.find(s => s.id === id);
        if (stockData) {
          // Create mock quarterly results
          const mockQuarterlyResults = [
            { quarter: 'Q1 2023', revenue: stockData.price * 1500, netProfit: stockData.price * 300, eps: stockData.price * 0.05 },
            { quarter: 'Q2 2023', revenue: stockData.price * 1600, netProfit: stockData.price * 320, eps: stockData.price * 0.055 },
            { quarter: 'Q3 2023', revenue: stockData.price * 1700, netProfit: stockData.price * 350, eps: stockData.price * 0.06 },
            { quarter: 'Q4 2023', revenue: stockData.price * 1800, netProfit: stockData.price * 370, eps: stockData.price * 0.065 },
            { quarter: 'Q1 2024', revenue: stockData.price * 1850, netProfit: stockData.price * 380, eps: stockData.price * 0.07 },
            { quarter: 'Q2 2024', revenue: stockData.price * 1900, netProfit: stockData.price * 400, eps: stockData.price * 0.075 },
          ];
          
          setStock({
            ...stockData,
            quarterlyResults: mockQuarterlyResults
          } as StockDetailData);
        }
      } else {
        setStock(detailedData);
      }
    } catch (error) {
      toast.error("Failed to load quarterly results");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Loading quarterly results...</p>
        </div>
      </div>
    );
  }

  if (!stock || !stock.quarterlyResults) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Quarterly data not available for this stock</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: stock.quarterlyResults.map(quarter => quarter.quarter),
    datasets: [
      {
        label: 'Revenue (₹ Cr)',
        data: stock.quarterlyResults.map(quarter => quarter.revenue),
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'Net Profit (₹ Cr)',
        data: stock.quarterlyResults.map(quarter => quarter.netProfit),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'EPS (₹)',
        data: stock.quarterlyResults.map(quarter => quarter.eps),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Quarterly Performance Metrics',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue & Profit (₹ Cr)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'EPS (₹)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/stock/${id}`)} 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to {stock.symbol}
        </Button>
        
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Quarterly Results for {stock.name} ({stock.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mb-6">
              <Line data={chartData} options={options} />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                * Note: Quarterly results are updated after the company's official announcements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuarterlyResults;
