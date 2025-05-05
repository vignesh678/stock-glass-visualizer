
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2, Bell, BellOff } from 'lucide-react';
import { portfolioService, PurchasedStock } from '@/services/portfolioService';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<PurchasedStock[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStock, setCurrentStock] = useState<PurchasedStock | null>(null);
  
  // Form states for add/edit
  const [stockId, setStockId] = useState<number | ''>('');
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [targetPrice, setTargetPrice] = useState<number | ''>('');
  const [currentPrice, setCurrentPrice] = useState<number | ''>('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/signin');
      return;
    }
    
    fetchPortfolio();
  }, [navigate]);

  const fetchPortfolio = async () => {
    try {
      const data = await portfolioService.getPortfolio();
      setStocks(data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      toast.error('Failed to load your portfolio');
    }
  };

  const resetForm = () => {
    setStockId('');
    setSymbol('');
    setName('');
    setPurchasePrice('');
    setQuantity('');
    setTargetPrice('');
    setCurrentPrice('');
    setCurrentStock(null);
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockId || !symbol || !name || !purchasePrice || !quantity || !currentPrice) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await portfolioService.addStock({
        stockId: Number(stockId),
        symbol,
        name,
        purchasePrice: Number(purchasePrice),
        quantity: Number(quantity),
        targetPrice: targetPrice ? Number(targetPrice) : null,
        currentPrice: Number(currentPrice)
      });
      
      toast.success('Stock added to portfolio');
      setIsAddDialogOpen(false);
      resetForm();
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to add stock:', error);
      toast.error('Failed to add stock to portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStock || !purchasePrice || !quantity) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await portfolioService.updateStock(currentStock._id!, {
        purchasePrice: Number(purchasePrice),
        quantity: Number(quantity),
        targetPrice: targetPrice ? Number(targetPrice) : null
      });
      
      toast.success('Stock updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStock = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stock from your portfolio?')) {
      return;
    }
    
    try {
      await portfolioService.deleteStock(id);
      toast.success('Stock removed from portfolio');
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to delete stock:', error);
      toast.error('Failed to remove stock');
    }
  };

  const handleSetTargetPrice = async (id: string, newTargetPrice: number | null) => {
    try {
      await portfolioService.updateStock(id, { targetPrice: newTargetPrice });
      toast.success(newTargetPrice ? 'Target price set' : 'Target price removed');
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to set target price:', error);
      toast.error('Failed to update target price');
    }
  };

  const openEditDialog = (stock: PurchasedStock) => {
    setCurrentStock(stock);
    setPurchasePrice(stock.purchasePrice);
    setQuantity(stock.quantity);
    setTargetPrice(stock.targetPrice || '');
    setIsEditDialogOpen(true);
  };

  const calculateTotalValue = (price: number, qty: number) => {
    return (price * qty).toFixed(2);
  };

  const calculateProfitLoss = (current: number, purchase: number, qty: number) => {
    const profitLoss = (current - purchase) * qty;
    const profitLossPercent = ((current - purchase) / purchase) * 100;
    
    return {
      value: profitLoss.toFixed(2),
      percent: profitLossPercent.toFixed(2),
      isPositive: profitLoss >= 0
    };
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Your Portfolio</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Stock
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {stocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Your portfolio is empty</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Stock</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                  <TableHead className="text-right">Target Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  const profitLoss = calculateProfitLoss(stock.currentPrice, stock.purchasePrice, stock.quantity);
                  
                  return (
                    <TableRow key={stock._id}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell className="text-right">₹{stock.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{stock.currentPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{stock.quantity}</TableCell>
                      <TableCell className="text-right">₹{calculateTotalValue(stock.currentPrice, stock.quantity)}</TableCell>
                      <TableCell className={`text-right ${profitLoss.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {profitLoss.isPositive ? '+' : ''}{profitLoss.value} ({profitLoss.isPositive ? '+' : ''}{profitLoss.percent}%)
                      </TableCell>
                      <TableCell className="text-right">
                        {stock.targetPrice ? `₹${stock.targetPrice.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => openEditDialog(stock)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {stock.targetPrice ? (
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSetTargetPrice(stock._id!, null)}
                            >
                              <BellOff className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const price = prompt('Enter target price:', stock.currentPrice.toString());
                                if (price !== null) {
                                  const numPrice = parseFloat(price);
                                  if (!isNaN(numPrice)) {
                                    handleSetTargetPrice(stock._id!, numPrice);
                                  }
                                }
                              }}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteStock(stock._id!)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add Stock Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Stock to Portfolio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStock} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockId">Stock ID</Label>
                <Input
                  id="stockId"
                  type="number"
                  value={stockId}
                  onChange={(e) => setStockId(e.target.valueAsNumber || '')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.valueAsNumber || '')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.valueAsNumber || '')}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price (₹)</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.valueAsNumber || '')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price (₹) (Optional)</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.valueAsNumber || '')}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {isLoading ? 'Adding...' : 'Add Stock'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Stock Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Stock</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditStock} className="space-y-4 pt-4">
            {currentStock && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{currentStock.symbol}</span>
                  <span>{currentStock.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPurchasePrice">Purchase Price (₹)</Label>
                    <Input
                      id="editPurchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.valueAsNumber || '')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editQuantity">Quantity</Label>
                    <Input
                      id="editQuantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.valueAsNumber || '')}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editTargetPrice">Target Price (₹) (Optional)</Label>
                  <Input
                    id="editTargetPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.valueAsNumber || '')}
                  />
                </div>
              </>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {isLoading ? 'Updating...' : 'Update Stock'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Portfolio;
