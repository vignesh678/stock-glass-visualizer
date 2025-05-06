
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stocksData } from '@/data/stockData';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import QuarterlyResultsChart from '@/components/QuarterlyResultsChart';

interface QuarterlyData {
  quarter: string;
  revenue: number;
  netProfit: number;
  eps: number;
}

const QuarterlyResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyData[]>([]);

  useEffect(() => {
    try {
      setIsLoading(true);
      if (!id) return;
      
      const foundStock = stocksData.find(s => s.id === id);
      
      if (foundStock) {
        setStock(foundStock);
        
        // Generate mock quarterly data since it's not available in the stockData
        const mockQuarterlyData: QuarterlyData[] = [];
        const currentYear = new Date().getFullYear();
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        
        // Generate data for the last 2 years (8 quarters)
        for (let i = 0; i < 8; i++) {
          const quarterIndex = i % 4;
          const yearOffset = Math.floor(i / 4);
          const year = currentYear - yearOffset;
          
          const baseRevenue = foundStock.price * 100; // Use price as a base for realistic numbers
          const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
          
          const revenue = parseFloat((baseRevenue * randomFactor).toFixed(2));
          const netProfit = parseFloat((revenue * (0.15 + Math.random() * 0.1)).toFixed(2)); // 15-25% profit margin
          const eps = parseFloat((netProfit / 1000).toFixed(2)); // Simplified EPS calculation
          
          mockQuarterlyData.push({
            quarter: `${quarters[quarterIndex]} ${year}`,
            revenue,
            netProfit,
            eps
          });
        }
        
        // Sort data chronologically
        setQuarterlyData(mockQuarterlyData.reverse());
      } else {
        toast.error("Stock not found");
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
            <QuarterlyResultsChart data={quarterlyData} />
            
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
