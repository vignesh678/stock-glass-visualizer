
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById, StockDetailData } from '@/data/niftyStocks';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import DividendHistoryChart from '@/components/DividendHistoryChart';

const DividendHistory = () => {
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

  const totalDividends = stock.dividendHistory.reduce((total, div) => total + div.amount, 0);
  const averageYield = stock.dividendHistory.reduce((total, div) => total + div.yieldPercentage, 0) / stock.dividendHistory.length;

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
                  <p className="text-sm text-muted-foreground">Total Dividends (5 Years)</p>
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
            
            <DividendHistoryChart data={stock.dividendHistory} />
            
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
