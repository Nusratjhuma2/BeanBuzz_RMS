import { MenuItem, Employee, InventoryItem, Order, Reservation, Table, AttendanceRecord, User } from '../types';

export const menuItems: MenuItem[] = [
  // Coffee Signature Drinks
  { 
    id: '1', 
    name: 'BeanBuzz Signature Espresso', 
    category: 'Coffee', 
    price: 350, 
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400ac?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Rich, full-bodied espresso with notes of dark chocolate and caramel',
    prepTime: 5,
    calories: 5,
    isSignature: true
  },
  { 
    id: '2', 
    name: 'Vanilla Bean Latte', 
    category: 'Coffee', 
    price: 420, 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Creamy latte with real vanilla bean and steamed milk foam art',
    prepTime: 8,
    calories: 220,
    isPopular: true
  },
  { 
    id: '3', 
    name: 'Caramel Macchiato', 
    category: 'Coffee', 
    price: 450, 
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Espresso with steamed milk, vanilla syrup, and caramel drizzle',
    prepTime: 7,
    calories: 240
  },
  { 
    id: '4', 
    name: 'Cold Brew Float', 
    category: 'Coffee', 
    price: 520, 
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dfd5?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'House-made cold brew topped with vanilla ice cream',
    prepTime: 3,
    calories: 180,
    isSignature: true
  },
  { 
    id: '5', 
    name: 'Mocha Supreme', 
    category: 'Coffee', 
    price: 480, 
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Rich espresso with premium chocolate, whipped cream, and cocoa dust',
    prepTime: 6,
    calories: 320
  },

  // Artisan Breakfast
  { 
    id: '6', 
    name: 'Avocado Toast Supreme', 
    category: 'Breakfast', 
    price: 780, 
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Sourdough toast with smashed avocado, poached egg, microgreens, and feta',
    prepTime: 12,
    calories: 420,
    isPopular: true
  },
  { 
    id: '7', 
    name: 'BeanBuzz Benedict', 
    category: 'Breakfast', 
    price: 950, 
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'English muffin, prosciutto, poached eggs, hollandaise, served with hash browns',
    prepTime: 15,
    calories: 580,
    isSignature: true
  },
  { 
    id: '8', 
    name: 'Artisan Pancakes', 
    category: 'Breakfast', 
    price: 750, 
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Fluffy buttermilk pancakes with seasonal berries and maple syrup',
    prepTime: 10,
    calories: 640
  },

  // Gourmet Burgers
  { 
    id: '9', 
    name: 'Truffle Beef Burger', 
    category: 'Burgers', 
    price: 1290, 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Wagyu beef patty, truffle aioli, aged cheddar, arugula, brioche bun',
    prepTime: 18,
    calories: 720,
    isSignature: true
  },
  { 
    id: '10', 
    name: 'BBQ Chicken Deluxe', 
    category: 'Burgers', 
    price: 980, 
    image: 'https://images.unsplash.com/photo-1637710847214-f91d99669e18?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Grilled chicken breast, house BBQ sauce, coleslaw, pickles, brioche',
    prepTime: 15,
    calories: 580,
    isPopular: true
  },
  { 
    id: '11', 
    name: 'Plant Power Burger', 
    category: 'Burgers', 
    price: 890, 
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Beyond meat patty, vegan cheese, avocado, sprouts, whole grain bun',
    prepTime: 12,
    calories: 480
  },

  // Artisan Pizzas
  { 
    id: '12', 
    name: 'Margherita Classica', 
    category: 'Pizza', 
    price: 1050, 
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil',
    prepTime: 20,
    calories: 480,
    isPopular: true
  },
  { 
    id: '13', 
    name: 'Prosciutto & Fig', 
    category: 'Pizza', 
    price: 1350, 
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'White sauce, prosciutto di Parma, fresh figs, arugula, balsamic glaze',
    prepTime: 22,
    calories: 620,
    isSignature: true
  },
  { 
    id: '14', 
    name: 'Mushroom Truffle', 
    category: 'Pizza', 
    price: 1180, 
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Mixed wild mushrooms, truffle oil, fontina cheese, fresh thyme',
    prepTime: 20,
    calories: 540
  },

  // Fresh Salads
  { 
    id: '15', 
    name: 'Quinoa Power Bowl', 
    category: 'Salads', 
    price: 850, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Quinoa, roasted vegetables, avocado, chickpeas, tahini dressing',
    prepTime: 8,
    calories: 420,
    isPopular: true
  },
  { 
    id: '16', 
    name: 'Mediterranean Delight', 
    category: 'Salads', 
    price: 820, 
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Mixed greens, olives, feta, tomatoes, cucumbers, lemon vinaigrette',
    prepTime: 6,
    calories: 320
  },

  // Artisan Pastries
  { 
    id: '17', 
    name: 'Chocolate Croissant', 
    category: 'Pastries', 
    price: 320, 
    image: 'https://images.unsplash.com/photo-1555507036-c84c87dd7ba1?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Buttery pastry filled with premium dark chocolate',
    prepTime: 3,
    calories: 280,
    isPopular: true
  },
  { 
    id: '18', 
    name: 'Almond Danish', 
    category: 'Pastries', 
    price: 380, 
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Flaky Danish pastry with almond cream and sliced almonds',
    prepTime: 2,
    calories: 320
  },

  // Beverages
  { 
    id: '19', 
    name: 'Fresh Orange Juice', 
    category: 'Beverages', 
    price: 280, 
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Freshly squeezed Valencia oranges',
    prepTime: 2,
    calories: 110
  },
  { 
    id: '20', 
    name: 'Sparkling Water', 
    category: 'Beverages', 
    price: 180, 
    image: 'https://images.unsplash.com/photo-1619719304580-c6f308e5315a?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Premium sparkling water with lemon',
    prepTime: 1,
    calories: 0
  },

  // Desserts
  { 
    id: '21', 
    name: 'Tiramisu Perfection', 
    category: 'Desserts', 
    price: 580, 
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Classic Italian tiramisu with ladyfingers and mascarpone',
    prepTime: 5,
    calories: 380,
    isSignature: true
  },
  { 
    id: '22', 
    name: 'Chocolate Lava Cake', 
    category: 'Desserts', 
    price: 650, 
    image: 'https://images.unsplash.com/photo-1612078960206-1709f1f0c969?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Warm chocolate cake with molten center, vanilla ice cream',
    prepTime: 15,
    calories: 520,
    isPopular: true
  },
  { 
    id: '23', 
    name: 'Seasonal Fruit Tart', 
    category: 'Desserts', 
    price: 450, 
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Buttery tart shell with pastry cream and fresh seasonal fruits',
    prepTime: 3,
    calories: 290
  },

  // Sides
  { 
    id: '24', 
    name: 'Truffle Fries', 
    category: 'Sides', 
    price: 520, 
    image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Hand-cut fries with truffle oil and parmesan',
    prepTime: 8,
    calories: 320,
    isPopular: true
  },
  { 
    id: '25', 
    name: 'Garlic Bread', 
    category: 'Sides', 
    price: 380, 
    image: 'https://images.unsplash.com/photo-1593527270723-834c53a3fed4?w=800&h=600&fit=crop&crop=center',
    available: true, 
    description: 'Artisan bread with roasted garlic butter and herbs',
    prepTime: 5,
    calories: 180
  }
];

export const employees: Employee[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    role: 'waiter', 
    email: 'john.smith@beanbuzz.com', 
    phone: '(555) 0101', 
    salary: 38000, 
    attendance: 96, 
    performance: 92, 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    hireDate: '2023-03-15',
    department: 'Service'
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    role: 'chef', 
    email: 'sarah.johnson@beanbuzz.com', 
    phone: '(555) 0102', 
    salary: 52000, 
    attendance: 98, 
    performance: 95, 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    hireDate: '2022-11-08',
    department: 'Kitchen'
  },
  { 
    id: '3', 
    name: 'Mike Davis', 
    role: 'waiter', 
    email: 'mike.davis@beanbuzz.com', 
    phone: '(555) 0103', 
    salary: 35000, 
    attendance: 89, 
    performance: 87, 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    hireDate: '2023-07-22',
    department: 'Service'
  },
  { 
    id: '4', 
    name: 'Emily Brown', 
    role: 'chef', 
    email: 'emily.brown@beanbuzz.com', 
    phone: '(555) 0104', 
    salary: 48000, 
    attendance: 94, 
    performance: 91, 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    hireDate: '2023-01-10',
    department: 'Kitchen'
  },
  { 
    id: '5', 
    name: 'David Wilson', 
    role: 'manager', 
    email: 'david.wilson@beanbuzz.com', 
    phone: '(555) 0105', 
    salary: 65000, 
    attendance: 97, 
    performance: 94, 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    hireDate: '2022-05-01',
    department: 'Management'
  },
  { 
    id: '6', 
    name: 'Lisa Chen', 
    role: 'waiter', 
    email: 'lisa.chen@beanbuzz.com', 
    phone: '(555) 0106', 
    salary: 36000, 
    attendance: 93, 
    performance: 89, 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    hireDate: '2023-09-05',
    department: 'Service'
  }
];

export const inventoryItems: InventoryItem[] = [
  { id: '1', name: 'Premium Coffee Beans', quantity: 45, unit: 'kg', minLevel: 20, status: 'ok', supplier: 'Blue Mountain Coffee Co.', lastRestocked: '2024-12-10' },
  { id: '2', name: 'Wagyu Beef Patties', quantity: 25, unit: 'pieces', minLevel: 30, status: 'low', supplier: 'Premium Meats Ltd.', lastRestocked: '2024-12-12' },
  { id: '3', name: 'Organic Chicken Breast', quantity: 18, unit: 'kg', minLevel: 15, status: 'ok', supplier: 'Farm Fresh Poultry', lastRestocked: '2024-12-13' },
  { id: '4', name: 'Fresh Mozzarella', quantity: 12, unit: 'kg', minLevel: 10, status: 'ok', supplier: 'Artisan Cheese Co.', lastRestocked: '2024-12-11' },
  { id: '5', name: 'San Marzano Tomatoes', quantity: 8, unit: 'cans', minLevel: 15, status: 'low', supplier: 'Italian Imports', lastRestocked: '2024-12-09' },
  { id: '6', name: 'Sourdough Flour', quantity: 35, unit: 'kg', minLevel: 25, status: 'ok', supplier: 'Artisan Bakery Supply', lastRestocked: '2024-12-14' },
  { id: '7', name: 'Fresh Basil', quantity: 5, unit: 'bunches', minLevel: 10, status: 'low', supplier: 'Green Garden Herbs', lastRestocked: '2024-12-13' },
  { id: '8', name: 'Truffle Oil', quantity: 3, unit: 'bottles', minLevel: 5, status: 'low', supplier: 'Gourmet Oils Ltd.', lastRestocked: '2024-12-08' },
  { id: '9', name: 'Free-Range Eggs', quantity: 144, unit: 'pieces', minLevel: 72, status: 'ok', supplier: 'Happy Farms', lastRestocked: '2024-12-14' },
  { id: '10', name: 'Avocados', quantity: 24, unit: 'pieces', minLevel: 20, status: 'ok', supplier: 'Fresh Produce Co.', lastRestocked: '2024-12-13' },
  { id: '11', name: 'Prosciutto di Parma', quantity: 2, unit: 'kg', minLevel: 3, status: 'low', supplier: 'Italian Delicacies', lastRestocked: '2024-12-10' },
  { id: '12', name: 'Premium Vanilla Extract', quantity: 0, unit: 'bottles', minLevel: 3, status: 'out', supplier: 'Flavor Masters', lastRestocked: '2024-12-05' }
];

export const orders: Order[] = [
  {
    id: '1',
    customerName: 'Alice Cooper',
    customerId: 'customer1',
    items: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[6], quantity: 1 },
      { ...menuItems[17], quantity: 2 }
    ],
    status: 'preparing',
    tableNumber: 5,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    total: 1820,
    waiterId: '1',
    estimatedTime: 18,
    notes: 'Extra shot in espresso, gluten-free bread for benedict',
    priority: 'high',
    reservationId: '1'
  },
  {
    id: '2',
    customerName: 'Bob Johnson',
    customerId: 'customer2',
    items: [
      { ...menuItems[8], quantity: 1 },
      { ...menuItems[23], quantity: 1 },
      { ...menuItems[19], quantity: 2 }
    ],
    status: 'pending',
    tableNumber: 3,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    total: 2050,
    waiterId: '3',
    estimatedTime: 20,
    priority: 'normal',
    reservationId: '2'
  },
  {
    id: '3',
    customerName: 'Carol Smith',
    customerId: 'customer3',
    items: [
      { ...menuItems[11], quantity: 1 },
      { ...menuItems[14], quantity: 1 },
      { ...menuItems[1], quantity: 2 }
    ],
    status: 'ready',
    tableNumber: 7,
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    total: 2880,
    waiterId: '1',
    estimatedTime: 22,
    notes: 'Dressing on the side for salad',
    priority: 'normal',
    reservationId: '3'
  },
  {
    id: '4',
    customerName: 'David Brown',
    customerId: 'customer1',
    items: [
      { ...menuItems[20], quantity: 1 },
      { ...menuItems[21], quantity: 1 },
      { ...menuItems[1], quantity: 1 }
    ],
    status: 'completed',
    tableNumber: 2,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    total: 1650,
    waiterId: '6',
    priority: 'normal',
    reservationId: '4'
  },
  {
    id: '5',
    customerName: 'Emma Wilson',
    customerId: 'customer4',
    items: [
      { ...menuItems[12], quantity: 1 },
      { ...menuItems[24], quantity: 1 },
      { ...menuItems[19], quantity: 1 }
    ],
    status: 'served',
    tableNumber: 8,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    total: 1850,
    waiterId: '3',
    estimatedTime: 25,
    priority: 'normal',
    reservationId: '5'
  }
];

export const reservations: Reservation[] = [
  {
    id: '1',
    customerName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 1234',
    date: '2024-12-15',
    time: '19:00',
    tableNumber: 5,
    guests: 4,
    status: 'confirmed',
    notes: 'Birthday celebration, need high chair',
    specialRequests: 'Window seating preferred'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 5678',
    date: '2024-12-15',
    time: '20:30',
    tableNumber: 8,
    guests: 2,
    status: 'confirmed',
    notes: 'Anniversary dinner',
    specialRequests: 'Quiet table please'
  },
  {
    id: '3',
    customerName: 'Robert Miller',
    email: 'robert.miller@email.com',
    phone: '(555) 9012',
    date: '2024-12-16',
    time: '18:00',
    tableNumber: 12,
    guests: 6,
    status: 'pending',
    notes: 'Business dinner',
    specialRequests: 'Private area if available'
  },
  {
    id: '4',
    customerName: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '(555) 3456',
    date: '2024-12-16',
    time: '19:30',
    tableNumber: 4,
    guests: 3,
    status: 'confirmed',
    notes: 'Family dinner'
  },
  {
    id: '5',
    customerName: 'Michael Garcia',
    email: 'michael.garcia@email.com',
    phone: '(555) 7890',
    date: '2024-12-17',
    time: '12:00',
    tableNumber: 2,
    guests: 2,
    status: 'confirmed',
    notes: 'Lunch meeting'
  }
];

export const tables: Table[] = [
  { id: 1, seats: 2, status: 'available', location: 'Window' },
  { id: 2, seats: 4, status: 'occupied', currentOrder: '4', location: 'Center' },
  { id: 3, seats: 4, status: 'occupied', currentOrder: '2', location: 'Corner' },
  { id: 4, seats: 6, status: 'reserved', location: 'Private' },
  { id: 5, seats: 4, status: 'occupied', currentOrder: '1', location: 'Window' },
  { id: 6, seats: 2, status: 'available', location: 'Bar' },
  { id: 7, seats: 6, status: 'occupied', currentOrder: '3', location: 'Center' },
  { id: 8, seats: 8, status: 'occupied', currentOrder: '5', location: 'Private' },
  { id: 9, seats: 2, status: 'available', location: 'Window' },
  { id: 10, seats: 4, status: 'available', location: 'Center' },
  { id: 11, seats: 4, status: 'available', location: 'Corner' },
  { id: 12, seats: 6, status: 'reserved', location: 'Private' }
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    date: '2024-12-15',
    checkIn: '09:00',
    checkOut: '17:00',
    status: 'present',
    hoursWorked: 8,
    breakTime: 30
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Sarah Johnson',
    date: '2024-12-15',
    checkIn: '08:30',
    checkOut: '16:30',
    status: 'present',
    hoursWorked: 8,
    breakTime: 30
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Mike Davis',
    date: '2024-12-15',
    checkIn: '09:15',
    checkOut: '17:15',
    status: 'late',
    hoursWorked: 8,
    breakTime: 30
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Emily Brown',
    date: '2024-12-15',
    checkIn: '09:00',
    checkOut: '17:00',
    status: 'present',
    hoursWorked: 8,
    breakTime: 45
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'David Wilson',
    date: '2024-12-14',
    checkIn: '',
    status: 'absent',
    hoursWorked: 0,
    reason: 'Sick leave'
  },
  {
    id: '6',
    employeeId: '6',
    employeeName: 'Lisa Chen',
    date: '2024-12-15',
    checkIn: '08:45',
    checkOut: '16:45',
    status: 'present',
    hoursWorked: 8,
    breakTime: 30
  }
];

// Daily metrics for dashboard
export const dailyMetrics = {
  revenue: 185680,
  orders: 47,
  customers: 42,
  averageOrderValue: 3952,
  popularItems: [
    { name: 'Vanilla Bean Latte', orders: 12 },
    { name: 'Avocado Toast Supreme', orders: 8 },
    { name: 'Truffle Beef Burger', orders: 6 }
  ],
  peakHours: [
    { hour: '8:00 AM', orders: 8 },
    { hour: '12:00 PM', orders: 15 },
    { hour: '6:00 PM', orders: 12 }
  ]
};

// Weekly analytics data
export const weeklyAnalytics = {
  totalRevenue: 1205740,
  totalOrders: 284,
  averageDaily: 172248,
  growth: 12.5,
  topCategory: 'Coffee',
  customerSatisfaction: 4.7
};

// Registered customers database
export const customers: User[] = [
  {
    id: 'customer1',
    name: 'Alice Cooper',
    email: 'alice@email.com',
    role: 'customer',
    phone: '(555) 0201'
  },
  {
    id: 'customer2',
    name: 'Bob Johnson',
    email: 'bob@email.com',
    role: 'customer',
    phone: '(555) 0202'
  },
  {
    id: 'customer3',
    name: 'Carol Smith',
    email: 'carol@email.com',
    role: 'customer',
    phone: '(555) 0203'
  },
  {
    id: 'customer4',
    name: 'Emma Wilson',
    email: 'emma@email.com',
    role: 'customer',
    phone: '(555) 0204'
  }
];

// Employee users (converted from employees array)
export const employeeUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@beanbuzz.com',
    role: 'waiter',
    phone: '(555) 0101'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@beanbuzz.com',
    role: 'chef',
    phone: '(555) 0102'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@beanbuzz.com',
    role: 'waiter',
    phone: '(555) 0103'
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily.brown@beanbuzz.com',
    role: 'chef',
    phone: '(555) 0104'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@beanbuzz.com',
    role: 'manager',
    phone: '(555) 0105'
  },
  {
    id: '6',
    name: 'Lisa Chen',
    email: 'lisa.chen@beanbuzz.com',
    role: 'waiter',
    phone: '(555) 0106'
  }
];

// User credentials - In real app, passwords would be hashed
export const userCredentials = {
  // Customer credentials
  'alice@email.com': { password: 'password123', userId: 'customer1' },
  'bob@email.com': { password: 'password123', userId: 'customer2' },
  'carol@email.com': { password: 'password123', userId: 'customer3' },
  'emma@email.com': { password: 'password123', userId: 'customer4' },
  
  // Employee credentials
  'john.smith@beanbuzz.com': { password: 'emp123', userId: '1' },
  'sarah.johnson@beanbuzz.com': { password: 'emp123', userId: '2' },
  'mike.davis@beanbuzz.com': { password: 'emp123', userId: '3' },
  'emily.brown@beanbuzz.com': { password: 'emp123', userId: '4' },
  'david.wilson@beanbuzz.com': { password: 'emp123', userId: '5' },
  'lisa.chen@beanbuzz.com': { password: 'emp123', userId: '6' }
};

// All users combined for lookup
export const allUsers: User[] = [...customers, ...employeeUsers];