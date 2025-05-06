
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, Trash2 } from 'lucide-react';
import { NiftyStock } from '@/data/niftyStocks';
import { fetchStockById, subscribeToStockUpdates } from '@/services/stockApi';

interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  price: number;
  targetPrice: number | null;
  addedDate: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [targetPrice, setTargetPrice] = useState<number | null>(null);

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlist(savedWatchlist);

    // Set up real-time updates for watchlist items
    if (savedWatchlist.length > 0) {
      const stockIds = savedWatchlist.map((item: WatchlistItem) => item.id);
      
      const unsubscribe = subscribeToStockUpdates(stockIds, (updatedStocks) => {
        // Update prices in watchlist
        setWatchlist(prev => prev.map(item => {
          const updatedStock = updatedStocks.find(stock => stock.id === item.id);
          if (updatedStock) {
            // Check for price alerts
            if (item.targetPrice !== null) {
              if (
                (updatedStock.price >= item.targetPrice && item.price < item.targetPrice) || 
                (updatedStock.price <= item.targetPrice && item.price > item.targetPrice)
              ) {
                toast.success(`${item.symbol} has reached your target price of ₹${item.targetPrice}!`, {
                  duration: 10000
                });
              }
            }
            
            return {
              ...item,
              price: updatedStock.price
            };
          }
          return item;
        }));
      });
      
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleRemoveFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
    toast.info("Stock removed from watchlist");
  };

  const handleSetTargetPrice = (id: number) => {
    if (targetPrice === null) return;
    
    setWatchlist(prev => prev.map(item => 
      item.id === id ? { ...item, targetPrice } : item
    ));
    
    toast.success(`Price alert set for ₹${targetPrice}`);
    setEditingId(null);
    setTargetPrice(null);
  };

  const handleCancelTargetPrice = () => {
    setEditingId(null);
    setTargetPrice(null);
  };

  const handleRemoveTargetPrice = (id: number) => {
    setWatchlist(prev => prev.map(item => 
      item.id === id ? { ...item, targetPrice: null } : item
    ));
    
    toast.info("Price alert removed");
  };

  const refreshPrices = async () => {
    try {
      const updatedWatchlist = await Promise.all(
        watchlist.map(async (item) => {
          const updatedStock = await fetchStockById(item.id);
          return updatedStock ? { ...item, price: updatedStock.price } : item;
        })
      );
      
      setWatchlist(updatedWatchlist);
      toast.success("Prices updated");
    } catch (error) {
      toast.error("Failed to refresh prices");
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Your Dashboard
          </h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Browse Stocks
          </Button>
        </div>
        
        <Card className="glass mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Your Watchlist</CardTitle>
              <Button size="sm" onClick={refreshPrices}>
                Refresh Prices
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {watchlist.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                <Button onClick={() => navigate('/')}>Browse Stocks</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Target Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlist.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        <Button 
                          variant="link" 
                          onClick={() => navigate(`/stock/${stock.id}`)}
                          className="p-0 h-auto font-medium"
                        >
                          {stock.symbol}
                        </Button>
                      </TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell className="text-right">₹{stock.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {editingId === stock.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Input
                              type="number"
                              value={targetPrice || ''}
                              onChange={(e) => setTargetPrice(parseFloat(e.target.value) || null)}
                              className="w-24"
                            />
                            <Button size="sm" onClick={() => handleSetTargetPrice(stock.id)}>Set</Button>
                            <Button size="sm" variant="outline" onClick={handleCancelTargetPrice}>Cancel</Button>
                          </div>
                        ) : (
                          stock.targetPrice ? `₹${stock.targetPrice.toFixed(2)}` : "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {stock.targetPrice ? (
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTargetPrice(stock.id)}
                            >
                              <BellOff className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(stock.id);
                                setTargetPrice(stock.price);
                              }}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFromWatchlist(stock.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                * Set price alerts to get notified when stocks reach your target price. Prices update every 30 seconds.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-xl">Market Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm text-muted-foreground">Nifty 50</h3>
                  <p className="text-2xl font-medium">19,634.25</p>
                  <p className="text-sm text-green-600">+123.45 (0.63%)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm text-muted-foreground">Sensex</h3>
                  <p className="text-2xl font-medium">64,832.14</p>
                  <p className="text-sm text-green-600">+386.83 (0.60%)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm text-muted-foreground">Bank Nifty</h3>
                  <p className="text-2xl font-medium">44,765.30</p>
                  <p className="text-sm text-red-600">-124.85 (-0.28%)</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
