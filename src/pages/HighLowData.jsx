
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById } from '@/data/niftyStocks';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HighLowData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      if (!id) return;
      
      const detailedData = getStockDetailById(parseInt(id));
      setStock(detailedData);
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

  if (!stock) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Stock not found</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: stock.yearlyHighLow.map(data => data.year).reverse(),
    datasets: [
      {
        label: 'Yearly High',
        data: stock.yearlyHighLow.map(data => data.high).reverse(),
        borderColor: '#8884d8',
        backgroundColor: '#8884d8',
      },
      {
        label: 'Yearly Low',
        data: stock.yearlyHighLow.map(data => data.low).reverse(),
        borderColor: '#82ca9d',
        backgroundColor: '#82ca9d',
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
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹)'
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
                  <p className="text-2xl font-bold">₹{Math.max(...stock.yearlyHighLow.map(item => item.high)).toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">5-Year Low</p>
                  <p className="text-2xl font-bold">₹{Math.min(...stock.yearlyHighLow.map(item => item.low)).toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Price Volatility</p>
                  <p className="text-2xl font-bold">{((Math.max(...stock.yearlyHighLow.map(item => item.high)) - Math.min(...stock.yearlyHighLow.map(item => item.low))) / Math.min(...stock.yearlyHighLow.map(item => item.low)) * 100).toFixed(2)}%</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-64 mb-6">
              <Line data={chartData} options={options} />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>High (₹)</TableHead>
                  <TableHead>Low (₹)</TableHead>
                  <TableHead>Range (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock.yearlyHighLow.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.year}</TableCell>
                    <TableCell>₹{data.high.toFixed(2)}</TableCell>
                    <TableCell>₹{data.low.toFixed(2)}</TableCell>
                    <TableCell>
                      {(((data.high - data.low) / data.low) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HighLowData;
