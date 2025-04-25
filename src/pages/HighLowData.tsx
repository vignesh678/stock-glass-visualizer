
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById, StockDetailData } from '@/data/niftyStocks';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HighLowData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockDetailData | null>(null);
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

  // Calculate volatility metrics
  const highestPrice = Math.max(...stock.yearlyHighLow.map(item => item.high));
  const lowestPrice = Math.min(...stock.yearlyHighLow.map(item => item.low));
  const volatilityRange = (((highestPrice - lowestPrice) / lowestPrice) * 100).toFixed(2);

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
            
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stock.yearlyHighLow.slice().reverse()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, undefined]}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="high" stroke="#8884d8" name="Yearly High" />
                  <Line type="monotone" dataKey="low" stroke="#82ca9d" name="Yearly Low" />
                </LineChart>
              </ResponsiveContainer>
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
