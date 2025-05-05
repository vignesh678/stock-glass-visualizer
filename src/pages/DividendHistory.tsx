
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StockData } from '@/data/stockData'; // Fix import name
import DividendHistoryChart from '@/components/DividendHistoryChart';
import QuarterlyDividendChart from '@/components/QuarterlyDividendChart';

// Define correct interface for DividendData
interface DividendData {
  year: string;
  amount: number;
  yieldPercentage: number;
  recordDate: string;
  exDate: string;
  paymentDate: string;
}

// Define correct props for QuarterlyDividendChart
interface QuarterlyDividendData {
  quarter: string;
  dividendPerShare: number;
}

const DividendHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [dividendHistory, setDividendHistory] = useState<DividendData[]>([]);
  const [quarterlyDividends, setQuarterlyDividends] = useState<QuarterlyDividendData[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        // Simulate API call
        // In a real app, you would fetch from your API
        setTimeout(() => {
          setStock({
            id: parseInt(id || '1'),
            symbol: 'HDFC',
            name: 'HDFC Bank Ltd.',
            price: 1689.75,
            change: 15.30,
            sector: 'Banking',
            marketCap: 9357.45,
            peRatio: 22.5,
            dividendYield: 3.2,
            volume: 4563789,
          });
          
          // Simulate dividend history data
          setDividendHistory([
            {
              year: '2023',
              amount: 18.0,
              yieldPercentage: 1.06,
              recordDate: '2023-05-15',
              exDate: '2023-05-10',
              paymentDate: '2023-05-25',
            },
            {
              year: '2022',
              amount: 15.5,
              yieldPercentage: 0.98,
              recordDate: '2022-05-14',
              exDate: '2022-05-09',
              paymentDate: '2022-05-24',
            },
            {
              year: '2021',
              amount: 12.5,
              yieldPercentage: 0.87,
              recordDate: '2021-05-12',
              exDate: '2021-05-07',
              paymentDate: '2021-05-20',
            },
            {
              year: '2020',
              amount: 10.0,
              yieldPercentage: 0.92,
              recordDate: '2020-05-15',
              exDate: '2020-05-10',
              paymentDate: '2020-05-25',
            },
          ]);
          
          // Quarterly dividend data for chart
          setQuarterlyDividends([
            { quarter: 'Q1 2023', dividendPerShare: 4.5 },
            { quarter: 'Q2 2023', dividendPerShare: 4.5 },
            { quarter: 'Q3 2023', dividendPerShare: 4.5 },
            { quarter: 'Q4 2023', dividendPerShare: 4.5 },
            { quarter: 'Q1 2022', dividendPerShare: 3.75 },
            { quarter: 'Q2 2022', dividendPerShare: 3.75 },
            { quarter: 'Q3 2022', dividendPerShare: 4.0 },
            { quarter: 'Q4 2022', dividendPerShare: 4.0 },
          ]);
        }, 500);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStock();
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {stock ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{stock.name} ({stock.symbol})</h1>
              <p className="text-muted-foreground">Dividend History</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Dividends</CardTitle>
                </CardHeader>
                <CardContent>
                  <DividendHistoryChart data={dividendHistory} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Dividends</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuarterlyDividendChart stock={{ quarterlyDividends: quarterlyDividends }} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dividend History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Dividend Amount (₹)</TableHead>
                      <TableHead>Dividend Yield</TableHead>
                      <TableHead>Record Date</TableHead>
                      <TableHead>Ex-Dividend Date</TableHead>
                      <TableHead>Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dividendHistory.map((entry) => (
                      <TableRow key={entry.year}>
                        <TableCell className="font-medium">{entry.year}</TableCell>
                        <TableCell>₹{entry.amount.toFixed(2)}</TableCell>
                        <TableCell>{(entry.yieldPercentage).toFixed(2)}%</TableCell>
                        <TableCell>{new Date(entry.recordDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(entry.exDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(entry.paymentDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading dividend history...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DividendHistory;
