import { useState } from 'react';
import { Reservation, Table } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, Users, Plus, MapPin, CheckCircle, XCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { tables } from '../../data/mockData';

interface ReservationsPageProps {
  reservations: Reservation[];
  onCreateReservation: (reservation: Omit<Reservation, 'id'>) => Reservation;
  onUpdateReservation: (id: string, updates: Partial<Reservation>) => void;
}

export function ReservationsPage({ 
  reservations, 
  onCreateReservation, 
  onUpdateReservation 
}: ReservationsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    notes: '',
    specialRequests: ''
  });

  // Get available tables for the selected date/time
  const getAvailableTables = () => {
    if (!formData.date || !formData.time) return tables;
    
    const reservedTables = reservations.filter(r => 
      r.date === formData.date && 
      r.status !== 'cancelled' &&
      Math.abs(new Date(`${r.date} ${r.time}`).getTime() - new Date(`${formData.date} ${formData.time}`).getTime()) < 2 * 60 * 60 * 1000 // 2 hour window
    ).map(r => r.tableNumber);

    return tables.filter(t => 
      !reservedTables.includes(t.id) && 
      t.seats >= formData.guests
    );
  };

  const availableTables = getAvailableTables();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (availableTables.length === 0) {
      toast.error('No available tables for this time slot');
      return;
    }

    // Find the best table (smallest that fits the group)
    const bestTable = availableTables
      .filter(t => t.seats >= formData.guests)
      .sort((a, b) => a.seats - b.seats)[0];

    if (!bestTable) {
      toast.error('No suitable table available for this group size');
      return;
    }

    const newReservationData = {
      ...formData,
      tableNumber: bestTable.id,
      status: 'pending' as const,
    };
    
    onCreateReservation(newReservationData);
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      notes: '',
      specialRequests: ''
    });
    setShowForm(false);
    toast.success('Reservation created successfully!');
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    onUpdateReservation(id, { status });
    toast.success(`Reservation ${status}!`);
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
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

  const todayReservations = reservations.filter(r => 
    r.date === new Date().toISOString().split('T')[0]
  );
  const confirmedToday = todayReservations.filter(r => r.status === 'confirmed');
  const pendingReservations = reservations.filter(r => r.status === 'pending');

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl mb-2">Table Reservations</h1>
          <p className="text-muted-foreground">
            Manage table bookings and availability
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Reservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="customer@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests *</Label>
                      <Select 
                        value={formData.guests.toString()} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, guests: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} guest{num !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Select 
                        value={formData.time} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
                            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Birthday celebration, anniversary, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Dietary restrictions, seating preferences, etc."
                    />
                  </div>

                  {/* Table Availability */}
                  {formData.date && formData.time && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Available Tables for {formData.date} at {formData.time}</h4>
                      {availableTables.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {availableTables.slice(0, 8).map(table => (
                            <div key={table.id} className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-green-500" />
                              <span>Table {table.id} ({table.seats} seats)</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-destructive">
                          <XCircle className="h-4 w-4" />
                          <span>No tables available for this time slot</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={availableTables.length === 0}>
                      Create Reservation
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedToday.length}</div>
              <p className="text-xs text-muted-foreground">Confirmed today</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReservations.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tables</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tables.filter(t => t.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Right now</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Reservations List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reservations.map((reservation) => (
          <motion.div key={reservation.id} variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reservation.customerName}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Table {reservation.tableNumber}</span>
                      {tables.find(t => t.id === reservation.tableNumber)?.location && (
                        <span>• {tables.find(t => t.id === reservation.tableNumber)?.location}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(reservation.status)} className="flex items-center gap-1">
                    {getStatusIcon(reservation.status)}
                    {reservation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.guests} guests</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{tables.find(t => t.id === reservation.tableNumber)?.seats} seats</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{reservation.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.phone}</span>
                    </div>
                  </div>

                  {(reservation.notes || reservation.specialRequests) && (
                    <div className="space-y-2 text-sm">
                      {reservation.notes && (
                        <div>
                          <p className="font-medium text-muted-foreground">Notes:</p>
                          <p className="text-xs bg-muted/50 p-2 rounded">{reservation.notes}</p>
                        </div>
                      )}
                      {reservation.specialRequests && (
                        <div>
                          <p className="font-medium text-muted-foreground">Special Requests:</p>
                          <p className="text-xs bg-muted/50 p-2 rounded">{reservation.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {reservation.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {reservations.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl mb-3">No reservations yet</h2>
          <p className="text-muted-foreground mb-6">
            Start by creating your first table reservation!
          </p>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create First Reservation
          </Button>
        </motion.div>
      )}
    </div>
  );
}