import { useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { CartPage } from "./components/pages/CartPage";
import { Dashboard } from "./components/pages/Dashboard";
import { InventoryPage } from "./components/pages/InventoryPage";
import { OrderQueuePage } from "./components/pages/OrderQueuePage";
import { EmployeesPage } from "./components/pages/EmployeesPage";
import { ReservationsPage } from "./components/pages/ReservationsPage";
import { OrdersPage } from "./components/pages/OrdersPage";
import { AttendancePage } from "./components/pages/AttendancePage";
import { SalaryPage } from "./components/pages/SalaryPage";
import { TakeOrderPage } from "./components/pages/TakeOrderPage";
import { OrdersInProgressPage } from "./components/pages/OrdersInProgressPage";
import { BillingPage } from "./components/pages/BillingPage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { FinancialsPage } from "./components/pages/FinancialsPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import {
  UserRole,
  User,
  CartItem,
  MenuItem,
  Order,
  Reservation,
  Table,
} from "./types";
import {
  orders as initialOrders,
  reservations as initialReservations,
  tables as initialTables,
  allUsers,
  userCredentials,
  customers,
} from "./data/mockData";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState("menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reservations, setReservations] = useState<
    Reservation[]
  >(initialReservations);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [registeredCustomers, setRegisteredCustomers] = useState<User[]>(customers);

  const handleLogin = (email: string, password: string, role?: UserRole) => {
    try {
      // Check if credentials exist in our database
      const credentials = userCredentials[email.toLowerCase()];
      
      if (!credentials) {
        toast.error("Invalid email or password. Please check your credentials.");
        return false;
      }
      
      if (credentials.password !== password) {
        toast.error("Invalid email or password. Please check your credentials.");
        return false;
      }
      
      // Find the user by userId
      const user = allUsers.find(u => u.id === credentials.userId);
      
      if (!user) {
        toast.error("User account not found. Please contact support.");
        return false;
      }
      
      // For employees, verify the role matches
      if (user.role !== 'customer' && role && user.role !== role) {
        toast.error("Invalid role selected for this account.");
        return false;
      }
      
      setCurrentUser(user);
      setCurrentPage(user.role === 'customer' ? "menu" : "dashboard");
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const handleRegister = (name: string, email: string, password: string, phone?: string) => {
    try {
      // Check if email already exists
      if (userCredentials[email.toLowerCase()]) {
        toast.error("An account with this email already exists.");
        return false;
      }
      
      // Create new customer user
      const newCustomer: User = {
        id: `customer${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: 'customer',
        phone
      };
      
      // Add to registered customers
      setRegisteredCustomers(prev => [...prev, newCustomer]);
      
      // Add credentials (in real app, password would be hashed)
      userCredentials[email.toLowerCase()] = {
        password,
        userId: newCustomer.id
      };
      
      // Add to all users
      allUsers.push(newCustomer);
      
      // Auto-login the new user
      setCurrentUser(newCustomer);
      setCurrentPage("menu");
      toast.success("Account created successfully! Welcome to BeanBuzz!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("menu");
    setCart([]);
    toast.success("Logged out successfully");
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.id === item.id,
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleUpdateQuantity = (
    itemId: string,
    quantity: number,
  ) => {
    if (quantity === 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== itemId),
    );
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    try {
      if (!currentUser) {
        toast.error("Please log in to place your order");
        setCurrentPage("login");
        return;
      }

      if (cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      if (!selectedReservation) {
        toast.error(
          "Please select a table reservation before placing your order",
        );
        return;
      }

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      if (total <= 0) {
        toast.error("Invalid order total");
        return;
      }

      const newOrder: Order = {
        id: Date.now().toString(),
        customerName: currentUser?.name || "Guest Customer",
        customerId: currentUser?.id || "guest",
        items: [...cart], // Create a copy to avoid reference issues
        status: "pending",
        timestamp: new Date(),
        total: total,
        tableNumber: selectedReservation.tableNumber,
        reservationId: selectedReservation.id,
        estimatedTime: 15 + Math.floor(Math.random() * 10), // Random 15-25 minutes
      };

      setOrders((prev) => [...prev, newOrder]);
      setCart([]);
      setSelectedReservation(null);
      toast.success("Order placed successfully!");
      setCurrentPage("orders");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleCreateReservation = (
    reservation: Omit<Reservation, "id">,
  ) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
    };
    setReservations((prev) => [...prev, newReservation]);
    setSelectedReservation(newReservation);
    toast.success("Table reserved successfully!");
    return newReservation;
  };

  const renderPage = () => {
    try {
      switch (currentPage) {
        case "login":
          return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
        case "menu":
          return (
            <LandingPage
              cart={cart}
              onAddToCart={handleAddToCart}
              onNavigate={setCurrentPage}
              currentUser={currentUser}
            />
          );
        case "cart":
          return (
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={handleCheckout}
              reservations={reservations}
              selectedReservation={selectedReservation}
              onSelectReservation={setSelectedReservation}
              onNavigateToReservations={() =>
                setCurrentPage("reservations")
              }
              currentUser={currentUser}
              onNavigateToLogin={() => setCurrentPage("login")}
            />
          );
        case "dashboard":
          return (
            <Dashboard
              userRole={currentUser?.role || "guest"}
            />
          );
        case "inventory":
          return <InventoryPage userRole={currentUser?.role} />;
        case "order-queue":
          return <OrderQueuePage />;
        case "employees":
          return <EmployeesPage />;
        case "reservations":
          return (
            <ReservationsPage
              reservations={reservations}
              onCreateReservation={handleCreateReservation}
              onUpdateReservation={(id, updates) => {
                setReservations((prev) =>
                  prev.map((r) =>
                    r.id === id ? { ...r, ...updates } : r,
                  ),
                );
              }}
            />
          );
        case "orders":
          return (
            <OrdersPage
              customerId={currentUser?.id}
              orders={orders}
            />
          );
        case "attendance":
          return <AttendancePage />;
        case "salary":
          return <SalaryPage />;
        case "take-order":
          return <TakeOrderPage />;
        case "orders-progress":
          return <OrdersInProgressPage />;
        case "billing":
          return <BillingPage />;
        case "reports":
          return <ReportsPage />;
        case "financials":
          return <FinancialsPage />;
        default:
          return (
            <LandingPage
              cart={cart}
              onAddToCart={handleAddToCart}
              onNavigate={setCurrentPage}
            />
          );
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      toast.error(
        "Failed to load page. Please try refreshing.",
      );
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-4">
              Please try refreshing the page
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          userRole={currentUser?.role || "guest"}
          userName={currentUser?.name}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto bg-background">
          {renderPage()}
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}