import { useState, useEffect } from 'react';
import { orders as mockOrders } from '../../data/mockData';
import { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Clock, CheckCircle, ChefHat, Utensils, Star, RotateCcw, MessageSquare, MapPin, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OrdersPageProps {
  customerId?: string;
  orders?: Order[];
}

export function OrdersPage({ customerId, orders = mockOrders }: OrdersPageProps) {
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [selectedTab, setSelectedTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    // Filter orders for current customer
    const filteredOrders = customerId 
      ? orders.filter(order => order.customerId === customerId)
      : orders;
    setCustomerOrders(filteredOrders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [customerId, orders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        customerOrders.forEach(order => {
          const elapsed = Math.floor((Date.now() - order.timestamp.getTime()) / 1000 / 60);
          newTimers[order.id] = elapsed;
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [customerOrders]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <ChefHat className="h-5 w-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'served':
        return <Utensils className="h-5 w-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'preparing':
        return 'default';
      case 'ready':
        return 'default';
      case 'served':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getProgressValue = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'preparing':
        return 50;
      case 'ready':
        return 75;
      case 'served':
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Service';
      case 'served':
        return 'Served';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getEstimatedTime = (order: Order) => {
    if (!order.estimatedTime) return null;
    const elapsed = timers[order.id] || 0;
    const remaining = Math.max(0, order.estimatedTime - elapsed);
    return remaining;
  };

  const activeOrders = customerOrders.filter(order => 
    !['completed'].includes(order.status)
  );

  const pastOrders = customerOrders.filter(order => 
    order.status === 'completed'
  );

  const reorderItems = (order: Order) => {
    // This would normally integrate with the cart functionality
    console.log('Reordering items from order:', order.id);
    // onAddToCart functionality would be called here for each item
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Your Orders</h1>
        <p className="text-muted-foreground">
          Track your current orders and view your order history
        </p>
      </motion.div>

      {/* Order Summary Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Utensils className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerOrders.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customerOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-6"
      >
        <Button
          variant={selectedTab === 'active' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('active')}
        >
          Active Orders
          {activeOrders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeOrders.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={selectedTab === 'history' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('history')}
        >
          Order History
          {pastOrders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pastOrders.length}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Active Orders */}
      <AnimatePresence mode="wait">
        {selectedTab === 'active' && (
          <motion.div
            key="active"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {activeOrders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <motion.div key={order.id} variants={cardVariants}>
                    <Card className="relative hover:shadow-lg transition-shadow duration-200">
                      {/* Priority indicator */}
                      {(order as any).priority === 'high' && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          PRIORITY
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>Table {order.tableNumber}</span>
                              {order.waiterId && (
                                <>
                                  <span>•</span>
                                  <User className="h-3 w-3" />
                                  <span>Waiter #{order.waiterId}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge variant={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Order Progress</span>
                              <span>{getProgressValue(order.status)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${getProgressValue(order.status)}%` }}
                              />
                            </div>
                          </div>

                          {/* Timer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {timers[order.id] || 0} minutes ago
                              </span>
                            </div>
                            
                            {order.estimatedTime && order.status === 'preparing' && (
                              <div className="text-sm text-muted-foreground">
                                <span>Est. {getEstimatedTime(order)} min remaining</span>
                              </div>
                            )}
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Items:</h4>
                            <div className="max-h-32 overflow-y-auto space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                  <div className="w-10 h-10 bg-muted rounded overflow-hidden shrink-0">
                                    <ImageWithFallback
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <span className="text-sm font-medium truncate">{item.quantity}x {item.name}</span>
                                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.notes && (
                            <div className="bg-muted/50 p-3 rounded">
                              <span className="font-medium text-sm">Special Notes: </span>
                              <span className="text-sm text-muted-foreground">{order.notes}</span>
                            </div>
                          )}

                          <div className="border-t pt-3">
                            <div className="flex justify-between font-medium text-lg">
                              <span>Total:</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Status-specific messages */}
                          {order.status === 'ready' && (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-sm text-green-700 dark:text-green-300"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Order Ready!</span>
                              </div>
                              <p className="mt-1">Your order is ready to be served. Please signal your waiter.</p>
                            </motion.div>
                          )}

                          {order.status === 'preparing' && (
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                              <div className="flex items-center gap-2">
                                <ChefHat className="h-4 w-4" />
                                <span className="font-medium">In the Kitchen</span>
                              </div>
                              <p className="mt-1">Our chefs are carefully preparing your order.</p>
                            </div>
                          )}

                          {order.status === 'pending' && (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg text-sm text-yellow-700 dark:text-yellow-300">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">Order Confirmed</span>
                              </div>
                              <p className="mt-1">Your order has been received and will begin preparation shortly.</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl mb-3">No active orders</h2>
                <p className="text-muted-foreground mb-6">
                  You don't have any orders in progress right now.
                </p>
                <Button onClick={() => window.history.back()}>
                  Browse Menu
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Order History */}
        {selectedTab === 'history' && (
          <motion.div
            key="history"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {pastOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastOrders.map((order) => (
                  <motion.div key={order.id} variants={cardVariants}>
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {order.timestamp.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded overflow-hidden shrink-0">
                                  <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between text-sm">
                                    <span className="truncate">{item.quantity}x {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{order.items.length - 3} more items
                              </p>
                            )}
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => reorderItems(order)}
                              className="flex-1"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Reorder
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Utensils className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl mb-3">No order history</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't completed any orders yet. Start by placing your first order!
                </p>
                <Button onClick={() => window.history.back()}>
                  Browse Menu
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}