import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

export function FinancialsPage() {
  const [period, setPeriod] = useState('monthly');

  // Financial data
  const revenueData = [
    { month: 'Jan', revenue: 85000, expenses: 62000, profit: 23000 },
    { month: 'Feb', revenue: 92000, expenses: 65000, profit: 27000 },
    { month: 'Mar', revenue: 88000, expenses: 63000, profit: 25000 },
    { month: 'Apr', revenue: 95000, expenses: 68000, profit: 27000 },
    { month: 'May', revenue: 102000, expenses: 71000, profit: 31000 },
    { month: 'Jun', revenue: 98000, expenses: 69000, profit: 29000 },
    { month: 'Jul', revenue: 105000, expenses: 73000, profit: 32000 },
    { month: 'Aug', revenue: 110000, expenses: 75000, profit: 35000 },
    { month: 'Sep', revenue: 108000, expenses: 74000, profit: 34000 },
    { month: 'Oct', revenue: 115000, expenses: 78000, profit: 37000 },
    { month: 'Nov', revenue: 118000, expenses: 80000, profit: 38000 },
    { month: 'Dec', revenue: 125000, expenses: 82000, profit: 43000 }
  ];

  // Expense breakdown
  const expenseData = [
    { category: 'Staff Salaries', amount: 32000, percentage: 39, color: '#8b4513' },
    { category: 'Food & Ingredients', amount: 24000, percentage: 29, color: '#22c55e' },
    { category: 'Rent & Utilities', amount: 12000, percentage: 15, color: '#f59e0b' },
    { category: 'Equipment & Maintenance', amount: 6000, percentage: 7, color: '#d97706' },
    { category: 'Marketing', amount: 4000, percentage: 5, color: '#dc2626' },
    { category: 'Other', amount: 4000, percentage: 5, color: '#8b5cf6' }
  ];

  // Cost analysis
  const costAnalysis = [
    { item: 'Food Cost %', current: 28, target: 30, status: 'good' },
    { item: 'Labor Cost %', current: 32, target: 30, status: 'attention' },
    { item: 'Overhead %', current: 18, target: 20, status: 'good' },
    { item: 'Profit Margin %', current: 22, target: 20, status: 'excellent' }
  ];

  // Cash flow data
  const cashFlowData = [
    { week: 'Week 1', inflow: 28000, outflow: 20000, net: 8000 },
    { week: 'Week 2', inflow: 32000, outflow: 22000, net: 10000 },
    { week: 'Week 3', inflow: 29000, outflow: 21000, net: 8000 },
    { week: 'Week 4', inflow: 34000, outflow: 23000, net: 11000 }
  ];

  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const profitGrowth = ((currentMonth.profit - previousMonth.profit) / previousMonth.profit * 100).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-green-500';
      case 'attention': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'attention':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive financial analysis and performance tracking
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.revenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">+{revenueGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.profit.toLocaleString()}</div>
            <p className="text-xs text-green-600">+{profitGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Target: 20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.expenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((currentMonth.expenses / currentMonth.revenue) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue vs Profit Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue, Expenses & Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8b4513" name="Revenue" />
                  <Bar dataKey="expenses" fill="#dc2626" name="Expenses" />
                  <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Year-to-Date Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium">
                      ${revenueData.reduce((sum, month) => sum + month.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-medium">
                      ${revenueData.reduce((sum, month) => sum + month.expenses, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Profit</span>
                    <span className="font-medium text-green-600">
                      ${revenueData.reduce((sum, month) => sum + month.profit, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Average Monthly Profit</span>
                    <span className="text-green-600">
                      ${Math.round(revenueData.reduce((sum, month) => sum + month.profit, 0) / revenueData.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Revenue Growth (YoY)</span>
                    <span className="font-medium text-green-600">+18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Growth (YoY)</span>
                    <span className="font-medium text-green-600">+22.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Growth</span>
                    <span className="font-medium text-green-600">+15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Order Value</span>
                    <span className="font-medium text-green-600">+8.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Details */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseData.map((expense, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{expense.category}</span>
                        <div className="text-right">
                          <span className="font-medium">${expense.amount.toLocaleString()}</span>
                          <Badge variant="outline" className="ml-2">
                            {expense.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={expense.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis & KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {costAnalysis.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{item.item}</h4>
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Current:</span>
                        <span className={`font-medium ${getStatusColor(item.status)}`}>
                          {item.current}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Target:</span>
                        <span className="text-muted-foreground">{item.target}%</span>
                      </div>
                      <Progress 
                        value={(item.current / item.target) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {item.current > item.target ? 
                          `${(item.current - item.target).toFixed(1)}% above target` :
                          `${(item.target - item.current).toFixed(1)}% below target`
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inflow" stroke="#22c55e" strokeWidth={2} name="Cash Inflow" />
                  <Line type="monotone" dataKey="outflow" stroke="#dc2626" strokeWidth={2} name="Cash Outflow" />
                  <Line type="monotone" dataKey="net" stroke="#8b4513" strokeWidth={2} name="Net Cash Flow" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Inflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${cashFlowData.reduce((sum, week) => sum + week.inflow, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Outflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${cashFlowData.reduce((sum, week) => sum + week.outflow, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${cashFlowData.reduce((sum, week) => sum + week.net, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}