import { useState, useEffect } from 'react';
import { orders } from '../../data/mockData';
import { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, CheckCircle } from 'lucide-react';

export function OrderQueuePage() {
  const [orderList, setOrderList] = useState<Order[]>(orders);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        orderList.forEach(order => {
          const elapsed = Math.floor((Date.now() - order.timestamp.getTime()) / 1000 / 60);
          newTimers[order.id] = elapsed;
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orderList]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrderList(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'preparing':
        return 'secondary';
      case 'ready':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (minutes: number) => {
    if (minutes > 20) return 'text-red-600';
    if (minutes > 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const activeOrders = orderList.filter(order => 
    ['pending', 'preparing', 'ready'].includes(order.status)
  );

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Order Queue</h1>
        <p className="text-muted-foreground">
          Manage and track order preparation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeOrders.map((order) => (
          <Card key={order.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                </div>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={getPriorityColor(timers[order.id] || 0)}>
                    {timers[order.id] || 0} minutes ago
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1"
                      size="sm"
                    >
                      Start Cooking
                    </Button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Ready
                    </Button>
                  )}

                  {order.status === 'ready' && (
                    <div className="flex-1 text-center p-2 bg-green-50 rounded text-sm text-green-700">
                      ✅ Ready for waiter to serve
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeOrders.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl mb-2">No pending orders</h2>
          <p className="text-muted-foreground">All orders have been completed!</p>
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Queue Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {activeOrders.filter(order => order.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {activeOrders.filter(order => order.status === 'preparing').length}
              </div>
              <p className="text-sm text-muted-foreground">In Preparation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeOrders.filter(order => order.status === 'ready').length}
              </div>
              <p className="text-sm text-muted-foreground">Ready to Serve</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}