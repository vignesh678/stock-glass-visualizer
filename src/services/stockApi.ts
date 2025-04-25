
import { niftyStocks, NiftyStock } from '@/data/niftyStocks';

// This is a mock API service that would normally connect to a real stock API
// In a production app, you would replace this with actual API calls

// Simulate API fetch delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchNiftyStocks = async (): Promise<NiftyStock[]> => {
  // Simulate API delay
  await delay(800);
  
  // Add some random price movements to simulate live data
  return niftyStocks.map(stock => {
    const randomChange = (Math.random() * 20 - 10).toFixed(2);
    const change = parseFloat(randomChange);
    const newPrice = Math.max(stock.price + change, 1).toFixed(2);
    
    return {
      ...stock,
      price: parseFloat(newPrice),
      change
    };
  });
};

export const fetchStockById = async (id: number): Promise<NiftyStock | null> => {
  await delay(500);
  const stock = niftyStocks.find(s => s.id === id);
  
  if (!stock) return null;
  
  // Add some random movement
  const randomChange = (Math.random() * 10 - 5).toFixed(2);
  const change = parseFloat(randomChange);
  const newPrice = Math.max(stock.price + change, 1).toFixed(2);
  
  return {
    ...stock,
    price: parseFloat(newPrice),
    change
  };
};

// Placeholder for a real-time stock API connection
// In a real app, this would connect to a websocket or polling API
export const subscribeToStockUpdates = (
  stockIds: number[],
  callback: (updatedStocks: NiftyStock[]) => void
) => {
  // Set up interval to simulate real-time updates
  const intervalId = setInterval(async () => {
    const updatedStocks = await Promise.all(
      stockIds.map(async id => {
        const stock = await fetchStockById(id);
        return stock;
      })
    );
    
    callback(updatedStocks.filter(Boolean) as NiftyStock[]);
  }, 30000); // Update every 30 seconds
  
  // Return function to unsubscribe
  return () => clearInterval(intervalId);
};

// Future enhancement: Connect to a real API like Alpha Vantage, Yahoo Finance, etc.
// Example implementation with Alpha Vantage (would require API key)
/*
export const fetchRealTimeStockData = async (symbol: string) => {
  const API_KEY = 'your_api_key';
  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${API_KEY}`
  );
  const data = await response.json();
  return data;
};
*/
