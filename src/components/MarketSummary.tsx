
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketSummary: React.FC = () => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-xl">Market Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm text-muted-foreground">Nifty 50</h3>
              <p className="text-2xl font-medium">19,634.25</p>
              <p className="text-sm text-green-600">+123.45 (0.63%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm text-muted-foreground">Sensex</h3>
              <p className="text-2xl font-medium">64,832.14</p>
              <p className="text-sm text-green-600">+386.83 (0.60%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm text-muted-foreground">Bank Nifty</h3>
              <p className="text-2xl font-medium">44,765.30</p>
              <p className="text-sm text-red-600">-124.85 (-0.28%)</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSummary;
