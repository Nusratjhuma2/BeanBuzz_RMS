import { useState, useEffect } from 'react';
import { orders, tables } from '../../data/mockData';
import { Order, Table } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, CheckCircle, Users, ChefHat, Utensils } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function OrdersInProgressPage() {
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
    
    const statusMessages = {
      'preparing': 'Order sent to kitchen',
      'ready': 'Order marked as ready',
      'served': 'Order served to customer',
      'completed': 'Order completed'
    };
    
    toast.success(statusMessages[newStatus] || 'Order status updated');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'preparing':
        return 'secondary';
      case 'ready':
        return 'default';
      case 'served':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <ChefHat className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'served':
        return <Utensils className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (minutes: number) => {
    if (minutes > 30) return 'text-red-600';
    if (minutes > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const activeOrders = orderList.filter(order => 
    ['pending', 'preparing', 'ready', 'served'].includes(order.status)
  );

  const getTableInfo = (tableNumber?: number) => {
    return tables.find(table => table.id === tableNumber);
  };

  // Group orders by status
  const pendingOrders = activeOrders.filter(order => order.status === 'pending');
  const preparingOrders = activeOrders.filter(order => order.status === 'preparing');
  const readyOrders = activeOrders.filter(order => order.status === 'ready');
  const servedOrders = activeOrders.filter(order => order.status === 'served');

  const OrderCard = ({ order }: { order: Order }) => {
    const tableInfo = getTableInfo(order.tableNumber);
    
    return (
      <Card key={order.id} className="relative">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Table {order.tableNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{order.customerName}</p>
              {tableInfo && (
                <p className="text-xs text-muted-foreground">
                  {tableInfo.seats} seats
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <Badge variant={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={getPriorityColor(timers[order.id] || 0)}>
                {timers[order.id] || 0} minutes ago
              </span>
              {order.estimatedTime && (
                <span className="text-muted-foreground">
                  (Est. {order.estimatedTime} min)
                </span>
              )}
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

            {order.notes && (
              <div className="text-sm bg-yellow-50 p-2 rounded">
                <span className="font-medium">Notes: </span>
                {order.notes}
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between font-medium mb-3">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <Button 
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1"
                    size="sm"
                  >
                    Send to Kitchen
                  </Button>
                )}
                
                {order.status === 'ready' && (
                  <Button 
                    onClick={() => updateOrderStatus(order.id, 'served')}
                    className="flex-1"
                    size="sm"
                  >
                    🍽️ Serve to Customer
                  </Button>
                )}

                {order.status === 'preparing' && (
                  <div className="flex-1 text-center p-2 bg-blue-50 rounded text-sm text-blue-700">
                    👨‍🍳 Being prepared in kitchen...
                  </div>
                )}

                {order.status === 'served' && (
                  <Button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    Complete Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Orders in Progress</h1>
        <p className="text-muted-foreground">
          Track and manage all table orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Kitchen</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{preparingOrders.length}</div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyOrders.length}</div>
            <p className="text-xs text-muted-foreground">Ready to serve</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Served</CardTitle>
            <Utensils className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{servedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      <div className="space-y-8">
        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <div>
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              Pending Orders ({pendingOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          </div>
        )}

        {/* Ready Orders */}
        {readyOrders.length > 0 && (
          <div>
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Ready to Serve ({readyOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          </div>
        )}

        {/* Served Orders */}
        {servedOrders.length > 0 && (
          <div>
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-gray-500" />
              Recently Served ({servedOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servedOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          </div>
        )}

        {/* Preparing Orders */}
        {preparingOrders.length > 0 && (
          <div>
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-blue-500" />
              In Kitchen ({preparingOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preparingOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          </div>
        )}
      </div>

      {activeOrders.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl mb-2">No active orders</h2>
          <p className="text-muted-foreground">All orders have been completed!</p>
        </div>
      )}
    </div>
  );
}