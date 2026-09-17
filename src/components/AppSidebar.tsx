import { 
  Coffee, 
  Home, 
  Menu, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  User, 
  LogOut,
  Users,
  ClipboardList,
  DollarSign,
  ChefHat,
  Package,
  BarChart3,
  FileText,
  Calculator
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { UserRole } from "../types";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole: UserRole;
  userName?: string;
  onLogout: () => void;
}

const sidebarMenus = {
  guest: [
    { title: "Menu", icon: Menu, page: "menu" },
    { title: "Login", icon: User, page: "login" },
  ],
  customer: [
    { title: "Menu", icon: Menu, page: "menu" },
    { title: "Cart", icon: ShoppingCart, page: "cart" },
    { title: "Reservations", icon: Calendar, page: "reservations" },
    { title: "Orders", icon: Clock, page: "orders" },
  ],
  waiter: [
    { title: "Dashboard", icon: Home, page: "dashboard" },
    { title: "Take Order", icon: ClipboardList, page: "take-order" },
    { title: "Orders in Progress", icon: Clock, page: "orders-progress" },
    { title: "Billing", icon: Calculator, page: "billing" },
    { title: "Attendance", icon: ClipboardList, page: "attendance" },
    { title: "Salary", icon: DollarSign, page: "salary" },
  ],
  chef: [
    { title: "Dashboard", icon: Home, page: "dashboard" },
    { title: "Order Queue", icon: ChefHat, page: "order-queue" },
    { title: "Inventory", icon: Package, page: "inventory" },
  ],
  manager: [
    { title: "Dashboard", icon: Home, page: "dashboard" },
    { title: "Reports", icon: BarChart3, page: "reports" },
    { title: "Employees", icon: Users, page: "employees" },
    { title: "Financials", icon: FileText, page: "financials" },
  ],
};

export function AppSidebar({ currentPage, onPageChange, userRole, userName, onLogout }: AppSidebarProps) {
  const menuItems = sidebarMenus[userRole] || sidebarMenus.guest;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Coffee className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h2 className="text-lg text-sidebar-foreground">BeanBuzz RMS</h2>
            <p className="text-sm text-sidebar-foreground/70">Coffee & Bistro</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton 
                    onClick={() => onPageChange(item.page)}
                    isActive={currentPage === item.page}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {userRole !== 'guest' && (
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-sidebar-foreground/70" />
              <span className="text-sm text-sidebar-foreground/70">
                {userName || 'User'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}