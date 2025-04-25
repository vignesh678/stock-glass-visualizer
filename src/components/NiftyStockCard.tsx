
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NiftyStock } from '@/data/niftyStocks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, History, FileText } from 'lucide-react';

interface StockCardProps {
  stock: NiftyStock;
}

const NiftyStockCard: React.FC<StockCardProps> = ({ stock }) => {
  const navigate = useNavigate();
  const isPositiveChange = stock.change >= 0;
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{stock.name}</h2>
            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
            <p className="text-xs text-muted-foreground mt-1">{stock.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₹{stock.price.toFixed(2)}</p>
            <p className={`text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {isPositiveChange ? '+' : ''}{stock.change.toFixed(2)} ({isPositiveChange ? '+' : ''}
              {(stock.change / (stock.price - stock.change) * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={() => navigate(`/stock/${stock.id}/quarterly`)}
          >
            <FileText className="w-4 h-4" />
            Quarterly Results
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={() => navigate(`/stock/${stock.id}/dividends`)}
          >
            <BarChart3 className="w-4 h-4" />
            Dividends
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={() => navigate(`/stock/${stock.id}/highlow`)}
          >
            <LineChart className="w-4 h-4" />
            High/Low
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={() => navigate(`/stock/${stock.id}/history`)}
          >
            <History className="w-4 h-4" />
            Company History
          </Button>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            variant="secondary"
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            onClick={() => navigate(`/stock/${stock.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NiftyStockCard;
