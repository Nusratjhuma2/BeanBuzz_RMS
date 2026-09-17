import { useState } from 'react';
import { menuItems, tables } from '../../data/mockData';
import { MenuItem, Table, CartItem } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Minus, ShoppingCart, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function TakeOrderPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const availableTables = tables.filter(table => table.status === 'available');

  const addToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(prev => prev.filter(item => item.id !== itemId));
      return;
    }
    setOrderItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = () => {
    if (!selectedTable || !customerName || orderItems.length === 0) {
      toast.error('Please fill in all required fields and add items to the order');
      return;
    }

    // Create new order
    const newOrder = {
      id: Date.now().toString(),
      customerName,
      items: orderItems,
      status: 'pending' as const,
      tableNumber: selectedTable,
      timestamp: new Date(),
      total: getTotalAmount(),
      notes: notes || undefined,
      waiterId: '1' // Current waiter ID
    };

    // Reset form
    setSelectedTable(null);
    setCustomerName('');
    setOrderItems([]);
    setNotes('');

    toast.success(`Order placed for Table ${selectedTable}!`);
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Take Order</h1>
        <p className="text-muted-foreground">
          Create a new order for customers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="table">Select Table</Label>
                <Select value={selectedTable?.toString() || ''} onValueChange={(value) => setSelectedTable(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.map((table) => (
                      <SelectItem key={table.id} value={table.id.toString()}>
                        Table {table.id} ({table.seats} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              {/* Current Order Summary */}
              {orderItems.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">Order Summary</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSubmitOrder} 
                className="w-full"
                disabled={!selectedTable || !customerName || orderItems.length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Place Order
              </Button>
            </CardContent>
          </Card>

          {/* Available Tables */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Available Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {availableTables.map((table) => (
                  <Button
                    key={table.id}
                    variant={selectedTable === table.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTable(table.id)}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-3 w-3" />
                    Table {table.id}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-2">
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <Badge variant="secondary">${item.price}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => addToOrder(item)}
                      disabled={!item.available}
                      className="flex-1"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                    {!item.available && (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}