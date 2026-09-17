import { useState } from 'react';
import { attendanceRecords, employees } from '../../data/mockData';
import { AttendanceRecord } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CheckCircle, Clock, XCircle, Calendar as CalendarIcon } from 'lucide-react';

export function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records] = useState<AttendanceRecord[]>(attendanceRecords);

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'default';
      case 'late':
        return 'secondary';
      case 'absent':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  const todayRecords = records.filter(record => record.date === selectedDate.toISOString().split('T')[0]);
  const presentCount = todayRecords.filter(record => record.status === 'present').length;
  const lateCount = todayRecords.filter(record => record.status === 'late').length;
  const absentCount = todayRecords.filter(record => record.status === 'absent').length;

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Attendance</h1>
        <p className="text-muted-foreground">
          Track employee attendance and working hours
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <p className="text-xs text-muted-foreground">Employees on time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                <p className="text-xs text-muted-foreground">Late arrivals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <p className="text-xs text-muted-foreground">Not present</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Attendance for {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {getEmployeeName(record.employeeId)}
                        </TableCell>
                        <TableCell>{record.checkIn || '-'}</TableCell>
                        <TableCell>{record.checkOut || 'Still working'}</TableCell>
                        <TableCell>
                          {record.hoursWorked ? `${record.hoursWorked}h` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <Badge variant={getStatusColor(record.status) as any}>
                              {record.status}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No attendance records</h3>
                  <p className="text-muted-foreground">
                    No attendance data found for this date.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Employees Overview */}
          <Card>
            <CardHeader>
              <CardTitle>All Employees - This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((employee) => {
                  const employeeRecords = records.filter(record => record.employeeId === employee.id);
                  const presentDays = employeeRecords.filter(record => record.status === 'present').length;
                  const totalDays = employeeRecords.length;
                  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

                  return (
                    <div key={employee.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{employee.role}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Attendance Rate:</span>
                          <span className={attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                            {attendanceRate}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Present Days:</span>
                          <span>{presentDays}/{totalDays}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}