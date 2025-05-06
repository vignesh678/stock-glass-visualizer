
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { fetchStockById, subscribeToStockUpdates } from '@/services/stockApi';
import Portfolio from '@/components/Portfolio';
import NotificationSettings from '@/components/NotificationSettings';
import { portfolioService } from '@/services/portfolioService';
import WatchList from '@/components/WatchList';
import MarketSummary from '@/components/MarketSummary';

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
                // Send notification via email if enabled
                const emailNotifEnabled = JSON.parse(localStorage.getItem('notificationSettings') || '{"email": false}').email;
                const userEmail = localStorage.getItem('userEmail');
                
                if (emailNotifEnabled && userEmail) {
                  portfolioService.sendEmailNotification(
                    userEmail,
                    `StockGlass Alert: ${item.symbol} Target Price Reached`,
                    `${item.symbol} (${item.name}) has reached your target price of ₹${item.targetPrice}!`
                  ).catch(error => console.error('Failed to send email notification:', error));
                }
                
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
  }, [navigate]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

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
        
        {/* Portfolio Component */}
        <div className="mb-8">
          <Portfolio />
        </div>
        
        {/* Watchlist Component */}
        <WatchList 
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          refreshPrices={refreshPrices}
        />
        
        {/* Notification Settings */}
        <div className="mb-8">
          <NotificationSettings />
        </div>
        
        {/* Market Summary Component */}
        <MarketSummary />
      </div>
    </div>
  );
};

export default Dashboard;
