
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NiftyStock } from '@/data/niftyStocks';
import { fetchNiftyStocks } from '@/services/stockApi';
import { toast } from 'sonner';
import NiftyStockCard from '@/components/NiftyStockCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stocks, setStocks] = useState<NiftyStock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNiftyStocks();
        setStocks(data);
      } catch (error) {
        toast.error("Failed to load stocks data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStocks();
  }, []);
  
  // Filter stocks based on search term
  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get top gainers and losers
  const sortedByChange = [...stocks].sort((a, b) => b.change - a.change);
  const topGainers = sortedByChange.slice(0, 3);
  const topLosers = [...sortedByChange].reverse().slice(0, 3);

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Nifty 50 Stock Tracker
          </h1>
          <p className="text-lg text-gray-600">
            View live data for India's top 50 companies
          </p>
        </div>
        
        {/* Search and Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search stocks by name, symbol or sector..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/70 pl-9"
                  />
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-500 mb-1">Top Gainers</h3>
              <ul className="space-y-2">
                {isLoading ? (
                  <li>Loading...</li>
                ) : (
                  topGainers.map(stock => (
                    <li key={stock.id} className="flex justify-between">
                      <Button 
                        variant="link" 
                        onClick={() => navigate(`/stock/${stock.id}`)}
                        className="p-0 h-auto"
                      >
                        {stock.symbol}
                      </Button>
                      <span className="text-sm text-green-600">+{stock.change.toFixed(2)}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-500 mb-1">Top Losers</h3>
              <ul className="space-y-2">
                {isLoading ? (
                  <li>Loading...</li>
                ) : (
                  topLosers.map(stock => (
                    <li key={stock.id} className="flex justify-between">
                      <Button 
                        variant="link" 
                        onClick={() => navigate(`/stock/${stock.id}`)}
                        className="p-0 h-auto"
                      >
                        {stock.symbol}
                      </Button>
                      <span className="text-sm text-red-600">{stock.change.toFixed(2)}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Stock Cards */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading stock data...</p>
            </div>
          ) : filteredStocks.length > 0 ? (
            filteredStocks.map(stock => (
              <NiftyStockCard key={stock.id} stock={stock} />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No stocks found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* API Note */}
        <div className="mt-12 glass p-4 text-center rounded-lg">
          <p className="text-sm text-muted-foreground">
            Note: This is using simulated market data. For real-time NSE data, a premium API would be required.
            <br />Price updates are simulated to occur every 30 seconds for watchlist items.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
