
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { stocksData } from '@/data/stockData';
import DividendHistoryChart from '@/components/DividendHistoryChart';

// Define the consistent DividendData type
interface DividendData {
  year: string;
  amount: number;
  yieldPercentage: number;
}

const DividendHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState<any>(null);
  const [dividendData, setDividendData] = useState<DividendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('chart');

  useEffect(() => {
    const fetchStockDetail = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        const foundStock = stocksData.find(s => s.id === id);
        
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
              year: year.toString(),
              amount,
              yieldPercentage
            });
          }
          
          setDividendData(mockDividendData.reverse());
        }
      } catch (error) {
        console.error('Error fetching stock detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockDetail();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!stock) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Stock not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link to={`/stock/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stock Detail
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{stock.name} - Dividend History</h1>
          <p className="text-gray-600">{stock.symbol}</p>
        </div>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle>Dividend Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div className="h-[400px]">
                  <DividendHistoryChart data={dividendData} />
                </div>
              </TabsContent>
              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border p-2 text-left">Year</th>
                        <th className="border p-2 text-left">Dividend Amount</th>
                        <th className="border p-2 text-left">Yield %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dividendData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                          <td className="border p-2">{item.year}</td>
                          <td className="border p-2">₹{item.amount.toFixed(2)}</td>
                          <td className="border p-2">{item.yieldPercentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Dividend Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {stock.name} has maintained a consistent dividend policy over the years,
              with a focus on returning value to shareholders while investing in future growth.
              The company typically announces dividends on a quarterly basis, with the final
              dividend being declared after the annual financial results.
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">Key Points:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Average Dividend Yield: {(dividendData.reduce((sum, item) => sum + item.yieldPercentage, 0) / dividendData.length).toFixed(2)}%</li>
                <li>Highest Annual Dividend: ₹{Math.max(...dividendData.map(item => item.amount)).toFixed(2)} ({dividendData.find(item => item.amount === Math.max(...dividendData.map(d => d.amount)))?.year})</li>
                <li>Dividend Payout Ratio: Approximately {(Math.random() * 30 + 30).toFixed(2)}%</li>
                <li>Dividend Growth Rate: {(Math.random() * 10 - 2).toFixed(2)}% (5-year CAGR)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DividendHistory;
