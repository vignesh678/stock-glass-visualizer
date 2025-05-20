
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById, StockDetailData } from '@/data/niftyStocks';
import { stocksData } from '@/data/stockData';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DividendHistory = () => {
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
          // Create mock dividend history
          const mockDividendHistory = stockData.quarterlyDividends
            .filter(q => q.value > 0)
            .map((q, index) => ({
              year: `202${Math.floor(index / 2)}`,
              amount: q.value * 4,
              yieldPercentage: (q.value * 4 / stockData.price) * 100
            }));
          
          setStock({
            ...stockData,
            dividendHistory: mockDividendHistory
          } as StockDetailData);
        }
      } else {
        setStock(detailedData);
      }
    } catch (error) {
      toast.error("Failed to load dividend history");
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
          <p>Loading dividend history...</p>
        </div>
      </div>
    );
  }

  if (!stock || !stock.dividendHistory) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>No dividend data available for this stock</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const totalDividends = stock.dividendHistory.reduce((total, div) => total + div.amount, 0);
  const averageYield = stock.dividendHistory.length > 0 
    ? stock.dividendHistory.reduce((total, div) => total + div.yieldPercentage, 0) / stock.dividendHistory.length
    : 0;
  
  const chartData = {
    labels: stock.dividendHistory.map(div => div.year),
    datasets: [
      {
        label: 'Dividend Amount (₹)',
        data: stock.dividendHistory.map(div => div.amount),
        backgroundColor: 'rgba(136, 132, 216, 0.6)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Yield (%)',
        data: stock.dividendHistory.map(div => div.yieldPercentage),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y1',
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
        display: true,
        text: 'Dividend History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        }
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
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
              Dividend History for {stock.name} ({stock.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Dividends</p>
                  <p className="text-2xl font-bold">₹{totalDividends.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Average Yield</p>
                  <p className="text-2xl font-bold">{averageYield.toFixed(2)}%</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-80 mb-6">
              <Bar data={chartData} options={options} />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                * Note: Dividend yields are calculated based on the share price at the time of declaration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DividendHistory;
