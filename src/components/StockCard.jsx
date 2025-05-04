
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import QuarterlyDividendChart from './QuarterlyDividendChart';
import YearlyHighLowChart from './YearlyHighLowChart';

const StockCard = ({ stock }) => {
  const isPositiveChange = stock.change >= 0;
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{stock.name}</h2>
            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
            <p className={`text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {isPositiveChange ? '+' : ''}{stock.change.toFixed(2)} ({isPositiveChange ? '+' : ''}
              {(stock.change / (stock.price - stock.change) * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/70 rounded-lg shadow-sm">
          <QuarterlyDividendChart stock={stock} />
        </div>
        <div className="bg-white/70 rounded-lg shadow-sm">
          <YearlyHighLowChart stock={stock} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
