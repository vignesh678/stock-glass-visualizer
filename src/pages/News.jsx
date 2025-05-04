
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { niftyStocks } from '@/data/niftyStocks';

// Mock news data since we don't have a real API
const generateMockNews = () => {
  const categories = ['Earnings', 'Market', 'Analysis', 'Corporate', 'Economy'];
  const headlines = [
    'Reports Strong Q2 Earnings, Beats Estimates',
    'Announces Strategic Expansion into New Markets',
    'Shares Jump on Positive Analyst Recommendations',
    'Appoints New Chief Executive Officer',
    'Secures Major Contract with Government',
    'Declares Higher Dividend for Shareholders',
    'Plans to Launch Innovative New Products',
    'Stock Drops Following Weak Quarterly Results',
    'Completes Acquisition of Rival Company',
    'Faces Regulatory Scrutiny Over Business Practices'
  ];
  
  const news = [];
  for (let i = 0; i < 20; i++) {
    const stock = niftyStocks[Math.floor(Math.random() * niftyStocks.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    news.push({
      id: i + 1,
      title: `${stock.name} ${headlines[Math.floor(Math.random() * headlines.length)]}`,
      summary: `The stock ${Math.random() > 0.5 ? 'rose' : 'fell'} by ${(Math.random() * 5).toFixed(2)}% in today's trading session following the announcement. Market analysts have ${Math.random() > 0.5 ? 'positive' : 'mixed'} outlook on the company's future prospects.`,
      date: date,
      category: categories[Math.floor(Math.random() * categories.length)],
      stockId: stock.id,
      stockName: stock.name,
      stockSymbol: stock.symbol
    });
  }
  
  // Sort by date (newest first)
  return news.sort((a, b) => b.date - a.date);
};

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    // Generate mock news data
    const mockNews = generateMockNews();
    setNewsItems(mockNews);
    setFilteredNews(mockNews);
  }, []);
  
  useEffect(() => {
    // Filter news based on search term and selected category
    let filtered = newsItems;
    
    if (searchTerm) {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.stockSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }
    
    setFilteredNews(filtered);
  }, [searchTerm, selectedCategory, newsItems]);

  // Get unique categories
  const categories = ['all', ...new Set(newsItems.map(item => item.category))];

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Latest Stock Market News
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest news and analysis about Nifty 50 companies
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search news..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/70 pl-9"
              />
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid grid-flow-col auto-cols-max overflow-x-auto">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* News Articles */}
        <div className="space-y-6">
          {filteredNews.length > 0 ? (
            filteredNews.map(news => (
              <Card key={news.id} className="glass-card overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10">{news.category}</Badge>
                    <Badge variant="outline" className="bg-secondary/10">{news.stockSymbol}</Badge>
                  </div>
                  <CardTitle className="text-xl">{news.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{formatDate(news.date)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{news.summary}</p>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Related to: {news.stockName}
                    </span>
                    <a 
                      href={`/stock/${news.stockId}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View Stock Details
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No news articles found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
