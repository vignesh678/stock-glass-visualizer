
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import DividendChart from '@/components/DividendChart';
import { getStockDetailById } from '@/data/niftyStocks';
import { toast } from "sonner";

interface DividendData {
  year: number;
  amount: number;
  yieldPercentage: number;
}

const DividendHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<any>(null);
  const [dividendData, setDividendData] = useState<DividendData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalDividends, setTotalDividends] = useState<number>(0);
  const [averageYield, setAverageYield] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        // Get detailed data from our static dataset
        const detailedData = getStockDetailById(parseInt(id));
        
        if (detailedData) {
          setStock(detailedData);
          setDividendData(detailedData.dividendHistory);
          
          // Calculate some summary statistics
          const total = detailedData.dividendHistory.reduce((sum, div) => sum + div.amount, 0);
          const avgYield = detailedData.dividendHistory.reduce((sum, div) => sum + div.yieldPercentage, 0) / 
                          detailedData.dividendHistory.length;
          
          setTotalDividends(total);
          setAverageYield(avgYield);
        }
      } catch (error) {
        toast.error("Failed to load dividend data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <p className="text-muted-foreground">Loading dividend data...</p>
        </div>
      </div>
    );
  }

  if (!stock || !dividendData.length) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-xl text-center">No dividend data available for this stock</p>
            <Button onClick={() => navigate(`/stock/${id}`)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stock Detail
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/stock/${id}`)} 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stock
        </Button>
        
        <Card className="glass-card mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Dividend History</CardTitle>
                <p className="text-muted-foreground">{stock.name} ({stock.symbol})</p>
              </div>
              <div className="mt-2 md:mt-0 grid grid-cols-2 gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Dividends</p>
                  <p className="font-bold text-lg">₹{totalDividends.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Avg. Yield</p>
                  <p className="font-bold text-lg">{averageYield.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 grid grid-cols-2 w-[200px] mx-auto">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="space-y-4">
                <div className="bg-card rounded-lg p-4 border">
                  <DividendChart dividendData={dividendData} />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dividend Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>
                      {stock.name} has been consistently paying dividends for the last {dividendData.length} years. 
                      {averageYield > 3 
                        ? " The average dividend yield is relatively high compared to the market average." 
                        : " The dividend yield is in line with the industry average."}
                    </p>
                    <p className="mt-2">
                      {dividendData[0].amount > dividendData[1].amount 
                        ? "The most recent dividend payment shows an increase from the previous year, indicating a positive trend."
                        : "The dividend payout has been relatively stable over the years."} 
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="table">
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>Dividend history for {stock.name}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Dividend Amount (₹)</TableHead>
                        <TableHead>Dividend Yield (%)</TableHead>
                        <TableHead className="text-right">YoY Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dividendData.map((item, index) => {
                        const prevYear = index < dividendData.length - 1 ? dividendData[index + 1].amount : item.amount;
                        const change = ((item.amount - prevYear) / prevYear) * 100;
                        return (
                          <TableRow key={item.year}>
                            <TableCell className="font-medium">{item.year}</TableCell>
                            <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                            <TableCell>{item.yieldPercentage.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">
                              <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                                {index < dividendData.length - 1 ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "-"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DividendHistory;
