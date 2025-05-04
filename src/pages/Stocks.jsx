
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { niftyStocks } from '@/data/niftyStocks';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const Stocks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadStocks = () => {
      try {
        setIsLoading(true);
        setStocks(niftyStocks);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            All Nifty 50 Stocks
          </h1>
          <p className="text-gray-600 mt-2">
            Browse and analyze India's top 50 companies
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search stocks by name, symbol or sector..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/70 pl-9"
            />
          </div>
        </div>
        
        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-36">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredStocks.length > 0 ? (
            filteredStocks.map(stock => (
              <Card 
                key={stock.id} 
                className="glass-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/stock/${stock.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-bold text-lg">{stock.name}</h2>
                      <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stock.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{stock.price.toFixed(2)}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Market Cap</p>
                      <p className="font-medium">₹{stock.marketCap.toFixed(2)}B</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">P/E Ratio</p>
                      <p className="font-medium">{stock.pe.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No stocks found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stocks;
