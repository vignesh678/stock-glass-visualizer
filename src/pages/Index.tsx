
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StockCard from '@/components/StockCard';
import { stocksData } from '@/data/stockData';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter stocks based on search term
  const filteredStocks = stocksData.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get top gainers and losers
  const sortedByChange = [...stocksData].sort((a, b) => b.change - a.change);
  const topGainers = sortedByChange.slice(0, 3);
  const topLosers = [...sortedByChange].reverse().slice(0, 3);

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Stock Data Visualization
          </h1>
          <p className="text-lg text-gray-600">
            View quarterly dividends and yearly high/low prices for top stocks
          </p>
        </div>
        
        {/* Search and Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search stocks..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/70"
                />
                <Button variant="secondary">Search</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-500 mb-1">Top Gainers</h3>
              <ul className="space-y-2">
                {topGainers.map(stock => (
                  <li key={stock.id} className="flex justify-between">
                    <span className="text-sm">{stock.symbol}</span>
                    <span className="text-sm text-green-600">+{stock.change.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-500 mb-1">Top Losers</h3>
              <ul className="space-y-2">
                {topLosers.map(stock => (
                  <li key={stock.id} className="flex justify-between">
                    <span className="text-sm">{stock.symbol}</span>
                    <span className="text-sm text-red-600">{stock.change.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Stock Cards */}
        <div className="space-y-6">
          {filteredStocks.length > 0 ? (
            filteredStocks.map(stock => (
              <StockCard key={stock.id} stock={stock} />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No stocks found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* MongoDB Connection Note */}
        <div className="mt-12 glass p-4 text-center rounded-lg">
          <p className="text-sm text-muted-foreground">
            Note: This is a frontend demonstration with dummy data. 
            <br />To connect to MongoDB and implement a full MERN stack, the Supabase integration is recommended.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
