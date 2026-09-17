import { employees } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Phone, Mail, DollarSign, TrendingUp, User } from 'lucide-react';

export function EmployeesPage() {
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Employee Management</h1>
        <p className="text-muted-foreground">
          Manage employee profiles and performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(employees.reduce((sum, emp) => sum + emp.performance, 0) / employees.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(employees.reduce((sum, emp) => sum + emp.attendance, 0) / employees.length)}%
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{employee.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {employee.role}
                    </Badge>
                    <Badge variant={getStatusColor(employee.status) as any} className="text-xs">
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                    <p className={`font-medium ${getPerformanceColor(employee.performance)}`}>
                      {employee.performance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className="font-medium">{employee.attendance}%</p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">Monthly Salary</p>
                  <p className="font-medium">${employee.salary.toLocaleString()}</p>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.role}</Badge>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <span className={getPerformanceColor(employee.performance)}>
                      {employee.performance}%
                    </span>
                  </TableCell>
                  <TableCell>{employee.attendance}%</TableCell>
                  <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(employee.status) as any}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}