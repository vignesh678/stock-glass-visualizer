
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, Trash2 } from 'lucide-react';
import { portfolioService } from '@/services/portfolioService';
import { authService } from '@/services/authService';

interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  price: number;
  targetPrice: number | null;
  addedDate: string;
}

interface WatchListProps {
  watchlist: WatchlistItem[];
  setWatchlist: React.Dispatch<React.SetStateAction<WatchlistItem[]>>;
  refreshPrices: () => Promise<void>;
}

const WatchList: React.FC<WatchListProps> = ({ watchlist, setWatchlist, refreshPrices }) => {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [targetPrice, setTargetPrice] = useState<number | null>(null);

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

  return (
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
  );
};

export default WatchList;
