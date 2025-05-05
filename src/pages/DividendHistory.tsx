
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fetchStockById } from '@/services/stockApi';
import DividendHistoryChart from '@/components/DividendHistoryChart';
import QuarterlyDividendChart from '@/components/QuarterlyDividendChart';

interface DividendData {
  year: string;
  dividend: number;
}

interface QuarterlyDividendData {
  quarter: string;
  dividend: number;
}

const DividendHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dividendHistory, setDividendHistory] = useState<DividendData[]>([]);
  const [quarterlyDividends, setQuarterlyDividends] = useState<QuarterlyDividendData[]>([]);
  const [customYear, setCustomYear] = useState<string>(new Date().getFullYear().toString());
  const [customDividend, setCustomDividend] = useState<string>('');
  const [customQuarter, setCustomQuarter] = useState<string>('Q1');

  useEffect(() => {
    const loadStockData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const stockData = await fetchStockById(parseInt(id));
          setStock(stockData);
          
          // Generate sample dividend history data
          const currentYear = new Date().getFullYear();
          const sampleDividendHistory = [];
          for (let i = 0; i < 10; i++) {
            const year = (currentYear - 9 + i).toString();
            const dividend = Math.round(Math.random() * 20 + 5);
            sampleDividendHistory.push({ year, dividend });
          }
          setDividendHistory(sampleDividendHistory);
          
          // Generate sample quarterly dividend data
          const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
          const sampleQuarterlyData = quarters.map(quarter => ({
            quarter,
            dividend: Math.round(Math.random() * 5 + 1)
          }));
          setQuarterlyDividends(sampleQuarterlyData);
          
        } catch (error) {
          console.error('Failed to fetch stock data:', error);
          toast.error('Failed to fetch stock data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadStockData();
  }, [id]);

  const handleAddYearlyDividend = () => {
    if (!customYear || !customDividend || isNaN(Number(customDividend))) {
      toast.error('Please enter a valid year and dividend amount');
      return;
    }
    
    // Check if year already exists
    const existingIndex = dividendHistory.findIndex(item => item.year === customYear);
    if (existingIndex >= 0) {
      const updatedHistory = [...dividendHistory];
      updatedHistory[existingIndex] = {
        year: customYear,
        dividend: Number(customDividend)
      };
      setDividendHistory(updatedHistory);
      toast.success('Dividend data updated');
    } else {
      setDividendHistory([
        ...dividendHistory,
        {
          year: customYear,
          dividend: Number(customDividend)
        }
      ]);
      toast.success('Dividend data added');
    }
    
    setCustomDividend('');
  };

  const handleAddQuarterlyDividend = () => {
    if (!customQuarter || !customDividend || isNaN(Number(customDividend))) {
      toast.error('Please select a quarter and enter a valid dividend amount');
      return;
    }
    
    // Check if quarter already exists
    const existingIndex = quarterlyDividends.findIndex(item => item.quarter === customQuarter);
    if (existingIndex >= 0) {
      const updatedQuarterly = [...quarterlyDividends];
      updatedQuarterly[existingIndex] = {
        quarter: customQuarter,
        dividend: Number(customDividend)
      };
      setQuarterlyDividends(updatedQuarterly);
      toast.success('Quarterly dividend data updated');
    } else {
      setQuarterlyDividends([
        ...quarterlyDividends,
        {
          quarter: customQuarter,
          dividend: Number(customDividend)
        }
      ]);
      toast.success('Quarterly dividend data added');
    }
    
    setCustomDividend('');
    setCustomQuarter('Q1');
  };

  // Prepare data for charts
  const annualChartData = dividendHistory.map(item => ({
    year: item.year,
    value: item.dividend
  }));
  
  const quarterlyChartData = quarterlyDividends.map(item => ({
    quarter: item.quarter,
    value: item.dividend
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-8">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="link"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          ← Back to Stock Details
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{stock?.name}</h1>
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="text-md font-normal">
            {stock?.symbol}
          </Badge>
          <h2 className="text-xl">
            Dividend History
          </h2>
        </div>
        
        <Tabs defaultValue="yearly">
          <TabsList className="mb-4">
            <TabsTrigger value="yearly">Yearly Dividends</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly Dividends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="yearly">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Annual Dividend History</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <DividendHistoryChart data={annualChartData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Dividend Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={customYear}
                        onChange={(e) => setCustomYear(e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dividend">Dividend Amount (₹)</Label>
                      <Input
                        id="dividend"
                        type="number"
                        value={customDividend}
                        onChange={(e) => setCustomDividend(e.target.value)}
                        placeholder="12.5"
                      />
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleAddYearlyDividend}
                    >
                      Add Dividend Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quarterly">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Quarterly Dividends (Current Year)</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <QuarterlyDividendChart data={quarterlyChartData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Quarterly Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quarter">Quarter</Label>
                      <select
                        id="quarter"
                        value={customQuarter}
                        onChange={(e) => setCustomQuarter(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="q-dividend">Dividend Amount (₹)</Label>
                      <Input
                        id="q-dividend"
                        type="number"
                        value={customDividend}
                        onChange={(e) => setCustomDividend(e.target.value)}
                        placeholder="3.5"
                      />
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleAddQuarterlyDividend}
                    >
                      Add Quarterly Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DividendHistory;
