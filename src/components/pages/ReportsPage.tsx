import { useState } from 'react';
import { orders, menuItems, employees } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Star } from 'lucide-react';

export function ReportsPage() {
  const [timeRange, setTimeRange] = useState('7days');

  // Generate sales data
  const salesData = [
    { day: 'Mon', revenue: 2840, orders: 34 },
    { day: 'Tue', revenue: 3200, orders: 42 },
    { day: 'Wed', revenue: 2650, orders: 28 },
    { day: 'Thu', revenue: 3800, orders: 48 },
    { day: 'Fri', revenue: 4200, orders: 56 },
    { day: 'Sat', revenue: 5100, orders: 67 },
    { day: 'Sun', revenue: 3900, orders: 51 }
  ];

  // Top selling items
  const topItemsData = menuItems.slice(0, 8).map((item, index) => ({
    name: item.name,
    sales: Math.floor(Math.random() * 50) + 10,
    revenue: (Math.floor(Math.random() * 50) + 10) * item.price
  })).sort((a, b) => b.sales - a.sales);

  // Category performance
  const categoryData = [
    { name: 'Coffee', value: 35, sales: 245, color: '#8b4513' },
    { name: 'Burgers', value: 25, sales: 180, color: '#22c55e' },
    { name: 'Pizza', value: 20, sales: 145, color: '#f59e0b' },
    { name: 'Pasta', value: 15, sales: 98, color: '#d97706' },
    { name: 'Desserts', value: 5, sales: 45, color: '#dc2626' }
  ];

  // Employee performance
  const employeePerformance = employees.map(emp => ({
    name: emp.name,
    orders: Math.floor(Math.random() * 30) + 15,
    rating: emp.performance / 100 * 5,
    tips: Math.floor(Math.random() * 200) + 50
  }));

  // Peak hours data
  const peakHoursData = [
    { hour: '8AM', orders: 12 },
    { hour: '9AM', orders: 18 },
    { hour: '10AM', orders: 25 },
    { hour: '11AM', orders: 32 },
    { hour: '12PM', orders: 45 },
    { hour: '1PM', orders: 52 },
    { hour: '2PM', orders: 38 },
    { hour: '3PM', orders: 28 },
    { hour: '4PM', orders: 22 },
    { hour: '5PM', orders: 35 },
    { hour: '6PM', orders: 48 },
    { hour: '7PM', orders: 55 },
    { hour: '8PM', orders: 42 }
  ];

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="flex-1 p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="menu">Menu Performance</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue & Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8b4513" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Selling Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topItemsData.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sales} orders</p>
                        </div>
                      </div>
                      <Badge variant="secondary">${item.revenue.toFixed(0)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeePerformance.map((emp, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">{emp.orders} orders served</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{emp.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">${emp.tips} tips</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Table Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Occupancy</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Hour Utilization</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Table Turnover Rate</span>
                    <span className="font-medium">2.3 times/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Dining Time</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kitchen Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Prep Time</span>
                    <span className="font-medium">12 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Accuracy</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food Waste %</span>
                    <span className="font-medium">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kitchen Efficiency</span>
                    <span className="font-medium">88%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}