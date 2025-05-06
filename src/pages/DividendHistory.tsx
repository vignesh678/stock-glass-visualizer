
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import DividendHistoryChart from '@/components/DividendHistoryChart';
import QuarterlyDividendChart from '@/components/QuarterlyDividendChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchStockById } from '@/services/stockApi';
import { stockData } from '@/data/stockData';

interface DividendData {
  year: string;
  dividendPerShare: number;
}

const DividendHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [stockDetails, setStockDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [dividendData, setDividendData] = useState<DividendData[]>([]);

  useEffect(() => {
    const loadStockData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const stock = await fetchStockById(parseInt(id));
          setStockDetails(stock);

          // Mock dividend data - in a real app this would come from an API
          const mockDividendData: DividendData[] = [
            { year: '2019', dividendPerShare: 12.5 },
            { year: '2020', dividendPerShare: 10.0 },
            { year: '2021', dividendPerShare: 15.0 },
            { year: '2022', dividendPerShare: 18.5 },
            { year: '2023', dividendPerShare: 22.0 },
          ];
          
          setDividendData(mockDividendData);
        } catch (error) {
          console.error('Failed to load stock data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadStockData();
  }, [id]);

  // Get the years for which we have dividend data
  const availableYears = dividendData.map(d => d.year);

  // Generate quarterly dividend data for the selected year (mock data)
  const quarterlyDividendData = [
    { quarter: 'Q1', dividendPerShare: selectedYear === '2023' ? 5.5 : selectedYear === '2022' ? 4.5 : 3.5 },
    { quarter: 'Q2', dividendPerShare: selectedYear === '2023' ? 5.5 : selectedYear === '2022' ? 4.5 : 3.5 },
    { quarter: 'Q3', dividendPerShare: selectedYear === '2023' ? 5.5 : selectedYear === '2022' ? 4.5 : 3.5 },
    { quarter: 'Q4', dividendPerShare: selectedYear === '2023' ? 5.5 : selectedYear === '2022' ? 5.0 : 4.0 },
  ];

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Dividend History {stockDetails && `- ${stockDetails.name} (${stockDetails.symbol})`}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Annual Dividend History */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Annual Dividend History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading dividend data...</p>
                </div>
              ) : (
                <div className="h-64">
                  <DividendHistoryChart data={dividendData} />
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                Annual dividend payouts over the last 5 years
              </p>
            </CardContent>
          </Card>

          {/* Quarterly Dividend Data */}
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quarterly Dividend</CardTitle>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading dividend data...</p>
                </div>
              ) : (
                <div className="h-64">
                  <QuarterlyDividendChart data={quarterlyDividendData} />
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                Quarterly dividend distribution for {selectedYear}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dividend Policy */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Dividend Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {stockDetails?.name || 'This company'} typically distributes dividends on a quarterly basis, with the final 
              dividend determined at the Annual General Meeting. The company aims to maintain a 
              dividend payout ratio of 30-40% of annual profits, subject to capital requirements 
              and business outlook.
            </p>
            <p className="text-sm text-muted-foreground">
              * Dividend policy information is indicative and based on historical patterns, not guaranteed for future payouts.
            </p>
          </CardContent>
        </Card>

        {/* Dividend Calendar */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Dividend Calendar (2023)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quarter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ex-Dividend Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Record Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Q1 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 18, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 30, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹5.50 per share</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Q2 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jul 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jul 18, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jul 31, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹5.50 per share</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Q3 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Oct 14, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Oct 17, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Oct 31, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹5.50 per share</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Q4 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jan 15, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jan 18, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jan 31, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹5.50 per share</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DividendHistory;
