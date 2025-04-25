
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetailById, StockDetailData } from '@/data/niftyStocks';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchStockById } from '@/services/stockApi';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        // Get dynamic price data from API
        const liveStockData = await fetchStockById(parseInt(id));
        
        // Get detailed data from our static dataset
        const detailedData = getStockDetailById(parseInt(id));
        
        // Combine the data
        if (liveStockData) {
          setStock({
            ...detailedData,
            price: liveStockData.price,
            change: liveStockData.change
          });
        } else {
          setStock(detailedData);
        }
      } catch (error) {
        toast.error("Failed to load stock data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleAddToWatchlist = () => {
    if (!stock) return;
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    // Check if stock is already in watchlist
    const isAlreadyAdded = watchlist.some((item: any) => item.id === stock.id);
    
    if (isAlreadyAdded) {
      toast.info("Stock already in watchlist");
      return;
    }
    
    // Add to watchlist
    const newWatchlist = [...watchlist, {
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      targetPrice: null, // Can be set later
      addedDate: new Date().toISOString()
    }];
    
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    toast.success(`${stock.symbol} added to watchlist`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Loading stock data...</p>
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

  const isPositiveChange = stock.change >= 0;

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        <Card className="glass-card mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">{stock.name}</CardTitle>
                <p className="text-xl text-muted-foreground">{stock.symbol}</p>
                <p className="text-sm text-muted-foreground mt-1">Sector: {stock.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₹{stock.price.toFixed(2)}</p>
                <p className={`text-lg ${isPositiveChange ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {isPositiveChange ? '+' : ''}{stock.change.toFixed(2)} ({isPositiveChange ? '+' : ''}
                  {(stock.change / (stock.price - stock.change) * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="font-medium">₹{(stock.marketCap * 1000).toLocaleString()} Cr</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">P/E Ratio</p>
                <p className="font-medium">{stock.pe.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Button 
                onClick={() => navigate(`/stock/${stock.id}/quarterly`)}
                variant="outline"
                className="justify-start"
              >
                Quarterly Results
              </Button>
              <Button 
                onClick={() => navigate(`/stock/${stock.id}/dividends`)}
                variant="outline"
                className="justify-start"
              >
                Dividend History
              </Button>
              <Button 
                onClick={() => navigate(`/stock/${stock.id}/highlow`)}
                variant="outline"
                className="justify-start"
              >
                High/Low Data
              </Button>
              <Button 
                onClick={() => navigate(`/stock/${stock.id}/history`)}
                variant="outline"
                className="justify-start"
              >
                Company History
              </Button>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleAddToWatchlist} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                Add to Watchlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDetail;
