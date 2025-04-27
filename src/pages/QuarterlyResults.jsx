
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById } from '@/data/niftyStocks';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import QuarterlyResultsChart from '@/components/QuarterlyResultsChart';

const QuarterlyResults = () => {
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
            <QuarterlyResultsChart data={stock.quarterlyResults} />
            
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
