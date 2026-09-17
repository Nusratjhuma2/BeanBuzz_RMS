export type UserRole = 'guest' | 'customer' | 'waiter' | 'chef' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  description?: string;
  prepTime?: number;
  calories?: number;
  isSignature?: boolean;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerId?: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  tableNumber: number; // Make required since table reservation is mandatory
  timestamp: Date;
  total: number;
  waiterId?: string;
  estimatedTime?: number;
  notes?: string;
  reservationId?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  tableNumber: number;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  specialRequests?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  salary: number;
  attendance: number;
  performance: number;
  status: 'active' | 'inactive';
  avatar?: string;
  hireDate?: string;
  department?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minLevel: number;
  status: 'ok' | 'low' | 'out';
  supplier?: string;
  lastRestocked?: string;
}

export interface Table {
  id: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
  location?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late';
  hoursWorked?: number;
  breakTime?: number;
  reason?: string;
}