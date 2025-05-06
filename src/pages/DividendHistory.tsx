
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DividendHistoryChart from '@/components/DividendHistoryChart';
import { StockData } from '@/data/stockData';

// Define the correct DividendData type
interface DividendData {
  year: string; // Changed from number to string to match the expected type
  amount: number;
  yieldPercentage: number;
}

const DividendHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState<any>(null);
  const [dividendData, setDividendData] = useState<DividendData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setIsLoading(true);
        const foundStock = StockData.find(s => s.id.toString() === id);
        
        if (foundStock) {
          setStock(foundStock);
          
          // Generate some mock dividend data
          const mockDividendData: DividendData[] = [];
          const currentYear = new Date().getFullYear();
          
          for (let i = 0; i < 10; i++) {
            const year = currentYear - i;
            const amount = parseFloat((Math.random() * 20 + 5).toFixed(2));
            const yieldPercentage = parseFloat((amount / foundStock.price * 100).toFixed(2));
            
            mockDividendData.push({
              year: year.toString(), // Convert to string to match DividendData type
              amount,
              yieldPercentage
            });
          }
          
          setDividendData(mockDividendData.reverse());
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStock();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Stock not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{stock.name} Dividend History</h1>
          <p className="text-gray-600">Historical dividend payments and yields</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dividend History (Last 10 Years)</CardTitle>
              <CardDescription>Annual dividend payments and yield percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <DividendHistoryChart data={dividendData} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dividend Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Year</th>
                      <th className="text-right py-3 px-4">Amount (₹)</th>
                      <th className="text-right py-3 px-4">Yield (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividendData.map((dividend) => (
                      <tr key={dividend.year} className="border-b">
                        <td className="py-3 px-4">{dividend.year}</td>
                        <td className="text-right py-3 px-4">{dividend.amount.toFixed(2)}</td>
                        <td className="text-right py-3 px-4">{dividend.yieldPercentage.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendHistory;
