import { CartItem, Reservation, User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, Calendar, MapPin, Users, AlertCircle, Clock, Percent, CheckCircle2, LogIn } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Alert, AlertDescription } from '../ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { formatBDT, formatBDTWithDecimals } from '../../utils/currency';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onCheckout: () => void;
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  onSelectReservation: (reservation: Reservation | null) => void;
  onNavigateToReservations: () => void;
  currentUser: User | null;
  onNavigateToLogin: () => void;
}

export function CartPage({ 
  cart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onCheckout, 
  reservations, 
  selectedReservation, 
  onSelectReservation,
  onNavigateToReservations,
  currentUser,
  onNavigateToLogin
}: CartPageProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedPrepTime = cart.reduce((max, item) => 
    Math.max(max, (item as any).prepTime || 15), 0
  );

  // Get user's reservations (for now, show all - in real app would filter by user)
  const userReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending');

  // Calculate potential discount
  const isLargeOrder = subtotal > 3000;
  const discount = isLargeOrder ? subtotal * 0.05 : 0;
  const finalTotal = total - discount;

  if (cart.length === 0) {
    return (
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Discover our delicious menu and add some tasty items to get started!
          </p>
          <Button size="lg" onClick={() => window.history.back()}>
            Browse Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Your Cart</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>{itemCount} items</span>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Est. {estimatedPrepTime}min prep time</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-lg truncate">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{formatBDT(item.price)}</Badge>
                              {(item as any).prepTime && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {(item as any).prepTime}min
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-right min-w-[80px]">
                              <p className="font-semibold text-lg">
                                {formatBDT(item.price * item.quantity)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveFromCart(item.id)}
                                className="text-destructive hover:text-destructive mt-1 h-auto p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Table Reservation Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Table Reservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userReservations.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need a table reservation to place an order. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-1 text-primary" 
                      onClick={onNavigateToReservations}
                    >
                      Make a reservation →
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Select your reservation:</label>
                    <Select 
                      value={selectedReservation?.id || ""} 
                      onValueChange={(value) => {
                        const reservation = userReservations.find(r => r.id === value);
                        onSelectReservation(reservation || null);
                      }}
                    >
                      <SelectTrigger className="h-auto py-3">
                        <SelectValue placeholder="Choose a table reservation" />
                      </SelectTrigger>
                      <SelectContent>
                        {userReservations.map((reservation) => (
                          <SelectItem key={reservation.id} value={reservation.id} className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <MapPin className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  Table {reservation.tableNumber}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {reservation.date} at {reservation.time} • {reservation.guests} guests
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedReservation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-accent/10 border border-accent/20 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                        <span className="font-medium">Selected Reservation</span>
                        <Badge variant={selectedReservation.status === 'confirmed' ? 'default' : 'secondary'}>
                          {selectedReservation.status}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Table {selectedReservation.tableNumber} • {selectedReservation.guests} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedReservation.date} at {selectedReservation.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{selectedReservation.customerName}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatBDT(subtotal)}</span>
                </div>
                
                {isLargeOrder && (
                  <div className="flex justify-between text-accent">
                    <span className="flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      Large Order Discount (5%)
                    </span>
                    <span>-{formatBDTWithDecimals(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatBDTWithDecimals(tax)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatBDTWithDecimals(finalTotal)}</span>
                </div>
              </div>

              {isLargeOrder && (
                <div className="bg-accent/10 border border-accent/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Percent className="h-4 w-4" />
                    <span className="font-medium">You saved {formatBDTWithDecimals(discount)} on this order!</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Estimated prep time: {estimatedPrepTime} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Order will be served to your table</span>
                </div>
              </div>

              {!currentUser ? (
                <div className="space-y-3">
                  <Alert className="border-primary/20 bg-primary/5">
                    <LogIn className="h-4 w-4" />
                    <AlertDescription>
                      Please log in to place your order and complete the checkout process.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={onNavigateToLogin} 
                    className="w-full" 
                    size="lg"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Place Order
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    onClick={onCheckout} 
                    className="w-full" 
                    size="lg"
                    disabled={!selectedReservation}
                  >
                    {selectedReservation ? 'Place Order' : 'Select Table to Continue'}
                  </Button>
                  
                  {!selectedReservation && userReservations.length > 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please select a table reservation to place your order
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}