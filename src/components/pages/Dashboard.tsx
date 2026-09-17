import { UserRole } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Clock, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  ChefHat,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Star,
  Coffee,
  Award,
  Activity,
  Target,
  Zap,
  Timer,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { dailyMetrics, weeklyAnalytics } from '../../data/mockData';
import { formatBDT } from '../../utils/currency';

interface DashboardProps {
  userRole: UserRole;
}

export function Dashboard({ userRole }: DashboardProps) {
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

  const getDashboardContent = () => {
    switch (userRole) {
      case 'customer':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">+2 from last month</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBDT(12485)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="mt-2">
                    <Progress value={68} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">68% of personal budget</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">Next: Today 7:00 PM</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Your Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>BeanBuzz Signature Espresso</span>
                      <Badge variant="secondary">3 orders</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Truffle Beef Burger</span>
                      <Badge variant="secondary">2 orders</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vanilla Bean Latte</span>
                      <Badge variant="secondary">2 orders</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Loyalty Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress to Gold Member</span>
                        <span>78/100 points</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Earn 22 more points for your next reward!</p>
                      <Badge variant="outline" className="mt-2">Silver Member</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );

      case 'waiter':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Activity className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Currently serving</p>
                  <div className="mt-2">
                    <Badge variant="destructive" className="text-xs">2 urgent</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Tables</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Out of 12 tables</p>
                  <div className="mt-2">
                    <Progress value={33} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Tips</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBDT(7200)}</div>
                  <p className="text-xs text-muted-foreground">+18% from yesterday</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">Above average</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Served</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">Target: 35</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Performance Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Order Accuracy</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Service Speed</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Rating</span>
                        <span>4.8/5</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-orange-500" />
                    Shift Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Hours Worked</span>
                      <span className="font-medium">6.5h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Break Time</span>
                      <span className="font-medium">45min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tables Served</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime</span>
                      <Badge variant="outline">None</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Recent Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">"Excellent service, very attentive!"</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last 5 reviews: 4.9/5 average
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );

      case 'chef':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <ChefHat className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">In queue</p>
                  <div className="mt-2">
                    <Badge variant="destructive" className="text-xs">1 priority</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14m</div>
                  <p className="text-xs text-muted-foreground">Today's average</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">Target: 15m</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                  <div className="mt-2">
                    <Progress value={84} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">84% of daily target</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                  <div className="mt-2">
                    <Badge variant="destructive" className="text-xs">1 out of stock</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Kitchen Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Order Accuracy</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Speed Efficiency</span>
                        <span>93%</span>
                      </div>
                      <Progress value={93} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Rating</span>
                        <span>4.9/5</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Inventory Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <span className="text-sm">Premium Vanilla Extract</span>
                      <Badge variant="destructive">Out</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                      <span className="text-sm">San Marzano Tomatoes</span>
                      <Badge variant="secondary">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                      <span className="text-sm">Fresh Basil</span>
                      <Badge variant="secondary">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );

      case 'manager':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dailyMetrics.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
                  <div className="mt-2">
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">85% of daily target</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dailyMetrics.orders}</div>
                  <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Avg: ${dailyMetrics.averageOrderValue.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">On duty now</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">3 waiters, 2 chefs</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">Out of 5.0</p>
                  <div className="mt-2">
                    <Progress value={96} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-primary" />
                    Popular Items Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dailyMetrics.popularItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.name}</span>
                        <Badge variant="secondary">{item.orders} orders</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Weekly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-medium">${weeklyAnalytics.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-medium">{weeklyAnalytics.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <Badge variant="secondary" className="text-green-600">
                        +{weeklyAnalytics.growth}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Category</span>
                      <Badge variant="outline">{weeklyAnalytics.topCategory}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Peak Hours Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dailyMetrics.peakHours.map((hour, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{hour.hour}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={hour.orders * 6.67} className="w-16 h-2" />
                          <span className="text-sm font-medium">{hour.orders}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Coffee className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl mb-2">Welcome to BeanBuzz RMS</h2>
            <p className="text-muted-foreground">Please log in to access your dashboard.</p>
          </div>
        );
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Good day';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    const roleMessages = {
      customer: 'Ready to order something delicious?',
      waiter: 'Ready to serve our guests?',
      chef: 'Ready to create culinary magic?',
      manager: "Let's keep BeanBuzz running smoothly!",
      guest: 'Welcome to BeanBuzz Coffee & Bistro'
    };

    return {
      greeting,
      message: roleMessages[userRole] || roleMessages.guest
    };
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">{welcome.greeting}! 👋</h1>
        <p className="text-muted-foreground text-lg">
          {welcome.message}
        </p>
      </motion.div>

      {getDashboardContent()}
    </div>
  );
}