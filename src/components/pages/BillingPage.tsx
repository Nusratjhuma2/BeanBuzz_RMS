import { useState } from 'react';
import { orders, tables } from '../../data/mockData';
import { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Receipt, Printer, CreditCard, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function BillingPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Filter orders that are ready for billing (served status)
  const billableOrders = orders.filter(order => 
    ['served', 'ready'].includes(order.status)
  );

  const generateBill = (order: Order) => {
    const tax = order.total * 0.08; // 8% tax
    const serviceCharge = order.total * 0.10; // 10% service charge
    const finalTotal = order.total + tax + serviceCharge;

    return {
      subtotal: order.total,
      tax,
      serviceCharge,
      finalTotal
    };
  };

  const handlePrintBill = (orderId: string) => {
    toast.success('Bill printed successfully!');
  };

  const handleProcessPayment = (orderId: string) => {
    toast.success('Payment processed successfully!');
    // In a real app, this would update the order status to 'completed'
  };

  const getTableInfo = (tableNumber?: number) => {
    return tables.find(table => table.id === tableNumber);
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Billing & Payment</h1>
        <p className="text-muted-foreground">
          Generate bills and process payments for completed orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Ready to Bill</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billableOrders.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${billableOrders.reduce((sum, order) => {
                const bill = generateBill(order);
                return sum + bill.finalTotal;
              }, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Including tax & service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${billableOrders.reduce((sum, order) => {
                const bill = generateBill(order);
                return sum + bill.serviceCharge;
              }, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">10% service charge</p>
          </CardContent>
        </Card>
      </div>

      {/* Billable Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {billableOrders.map((order) => {
          const bill = generateBill(order);
          const tableInfo = getTableInfo(order.tableNumber);

          return (
            <Card key={order.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    {tableInfo && (
                      <p className="text-xs text-muted-foreground">
                        {tableInfo.seats} seats
                      </p>
                    )}
                  </div>
                  <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Order Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Bill Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${bill.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%):</span>
                      <span>${bill.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Charge (10%):</span>
                      <span>${bill.serviceCharge.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>${bill.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-sm bg-yellow-50 p-2 rounded">
                      <span className="font-medium">Notes: </span>
                      {order.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handlePrintBill(order.id)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print Bill
                    </Button>
                    <Button 
                      onClick={() => handleProcessPayment(order.id)}
                      className="flex-1"
                      size="sm"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toast.success('Cash payment recorded')}
                    >
                      Cash
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toast.success('Card payment processed')}
                    >
                      Card
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toast.success('Digital payment processed')}
                    >
                      Digital
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {billableOrders.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl mb-2">No orders ready for billing</h2>
          <p className="text-muted-foreground">
            Orders will appear here when they're ready for payment processing.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {billableOrders.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  billableOrders.forEach(order => handlePrintBill(order.id));
                  toast.success(`Printed ${billableOrders.length} bills`);
                }}
                variant="outline"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print All Bills
              </Button>
              <Button 
                onClick={() => {
                  const total = billableOrders.reduce((sum, order) => {
                    const bill = generateBill(order);
                    return sum + bill.finalTotal;
                  }, 0);
                  toast.success(`Total revenue: $${total.toFixed(2)}`);
                }}
                variant="outline"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Calculate Total Revenue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}