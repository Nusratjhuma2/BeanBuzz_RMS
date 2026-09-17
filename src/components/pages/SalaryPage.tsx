import { useState } from 'react';
import { employees } from '../../data/mockData';
import { Employee } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface SalaryInfo extends Employee {
  paidAmount: number;
  pendingAmount: number;
  bonuses: number;
  deductions: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  paymentDate?: string;
}

export function SalaryPage() {
  const [salaryData] = useState<SalaryInfo[]>([
    {
      ...employees[0],
      paidAmount: 35000,
      pendingAmount: 0,
      bonuses: 500,
      deductions: 200,
      paymentStatus: 'paid',
      paymentDate: '2024-12-01'
    },
    {
      ...employees[1],
      paidAmount: 45000,
      pendingAmount: 0,
      bonuses: 1000,
      deductions: 300,
      paymentStatus: 'paid',
      paymentDate: '2024-12-01'
    },
    {
      ...employees[2],
      paidAmount: 28000,
      pendingAmount: 4000,
      bonuses: 300,
      deductions: 100,
      paymentStatus: 'partial',
      paymentDate: '2024-12-01'
    },
    {
      ...employees[3],
      paidAmount: 0,
      pendingAmount: 42000,
      bonuses: 800,
      deductions: 250,
      paymentStatus: 'pending'
    },
    {
      ...employees[4],
      paidAmount: 30000,
      pendingAmount: 0,
      bonuses: 400,
      deductions: 150,
      paymentStatus: 'paid',
      paymentDate: '2024-12-01'
    }
  ]);

  const getStatusColor = (status: SalaryInfo['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: SalaryInfo['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalSalaries = salaryData.reduce((sum, emp) => sum + emp.salary, 0);
  const totalPaid = salaryData.reduce((sum, emp) => sum + emp.paidAmount, 0);
  const totalPending = salaryData.reduce((sum, emp) => sum + emp.pendingAmount, 0);
  const totalBonuses = salaryData.reduce((sum, emp) => sum + emp.bonuses, 0);

  const currentEmployee = salaryData[0]; // Assuming current logged-in employee

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Salary Information</h1>
        <p className="text-muted-foreground">
          View salary details and payment status
        </p>
      </div>

      {/* Personal Salary Card (for employee view) */}
      <Card className="mb-8 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Your Salary - December 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Base Salary</p>
              <p className="text-2xl font-bold">${currentEmployee.salary.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Bonuses</p>
              <p className="text-2xl font-bold text-green-600">+${currentEmployee.bonuses}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Deductions</p>
              <p className="text-2xl font-bold text-red-600">-${currentEmployee.deductions}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-2xl font-bold">
                ${(currentEmployee.salary + currentEmployee.bonuses - currentEmployee.deductions).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-700">Payment Status: Paid</span>
            </div>
            <p className="text-sm text-green-600">
              Your salary for December 2024 has been paid on {currentEmployee.paymentDate}
            </p>
          </div>

          {/* Performance Bonus Info */}
          <div className="mt-4 p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Performance Bonus Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Performance ({currentEmployee.performance}%)</span>
                <span>+${Math.round(currentEmployee.bonuses * 0.6)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Attendance Bonus ({currentEmployee.attendance}%)</span>
                <span>+${Math.round(currentEmployee.bonuses * 0.4)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalaries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalBonuses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Performance rewards</p>
          </CardContent>
        </Card>
      </div>

      {/* All Employees Salary Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Salary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {salaryData.map((employee) => {
              const netPay = employee.salary + employee.bonuses - employee.deductions;
              const paymentProgress = employee.paidAmount / netPay * 100;

              return (
                <div key={employee.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(employee.paymentStatus)}
                      <Badge variant={getStatusColor(employee.paymentStatus) as any}>
                        {employee.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Base Salary</p>
                      <p className="font-medium">${employee.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bonuses</p>
                      <p className="font-medium text-green-600">+${employee.bonuses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deductions</p>
                      <p className="font-medium text-red-600">-${employee.deductions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Net Pay</p>
                      <p className="font-medium">${netPay.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Payment Progress</span>
                      <span>{Math.round(paymentProgress)}%</span>
                    </div>
                    <Progress value={paymentProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Paid: ${employee.paidAmount.toLocaleString()}</span>
                      <span>Pending: ${employee.pendingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {employee.paymentDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last payment: {employee.paymentDate}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}