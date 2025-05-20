
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById, StockDetailData } from '@/data/niftyStocks';
import { stocksData } from '@/data/stockData';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HighLowData = () => {
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
          setStock(stockData as unknown as StockDetailData);
        }
      } else {
        setStock(detailedData);
      }
    } catch (error) {
      toast.error("Failed to load high/low data");
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
          <p>Loading price history...</p>
        </div>
      </div>
    );
  }

  if (!stock || !stock.yearlyHighLow) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Price range data not available for this stock</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Calculate volatility metrics
  const highestPrice = Math.max(...stock.yearlyHighLow.map(item => item.high));
  const lowestPrice = Math.min(...stock.yearlyHighLow.map(item => item.low));
  const volatilityRange = (((highestPrice - lowestPrice) / lowestPrice) * 100).toFixed(2);

  // Prepare data for Chart.js
  const labels = stock.yearlyHighLow.map(item => item.year);
  const highData = stock.yearlyHighLow.map(item => item.high);
  const lowData = stock.yearlyHighLow.map(item => item.low);
  const rangeData = stock.yearlyHighLow.map(item => item.high - item.low);
  
  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Price Range',
        data: rangeData,
        backgroundColor: 'rgba(53, 162, 235, 0.3)',
        borderWidth: 0
      },
      {
        type: 'line' as const,
        label: 'High Price',
        data: highData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        type: 'line' as const,
        label: 'Low Price',
        data: lowData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 8
      }
    ]
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
        text: 'Yearly High/Low Price Range',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '₹' + context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (₹)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
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
              Price Range History for {stock.name} ({stock.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">5-Year High</p>
                  <p className="text-2xl font-bold">₹{highestPrice.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">5-Year Low</p>
                  <p className="text-2xl font-bold">₹{lowestPrice.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Price Volatility</p>
                  <p className="text-2xl font-bold">{volatilityRange}%</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-80 mb-6">
              <Bar data={chartData} options={options} />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                * Note: Price range represents the difference between yearly high and low prices.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HighLowData;
