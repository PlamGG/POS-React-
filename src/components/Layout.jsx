import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  BarChart2, 
  Settings, 
  LogOut, 
  Package, 
  DollarSign, 
  MessageSquare, 
  FileText,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: LayoutGrid, label: 'POS', path: '/', description: 'จัดการการขาย' },
  { icon: BarChart2, label: 'Dashboard', path: '/dashboard', description: 'ภาพรวมธุรกิจ' },
  { icon: Package, label: 'Stock', path: '/stock', description: 'จัดการสต็อกสินค้า' },
  { icon: DollarSign, label: 'Food Cost', path: '/food-cost', description: 'คำนวณต้นทุนอาหาร' },
  { icon: MessageSquare, label: 'Customer Feedback', path: '/customer-feedback', description: 'ความคิดเห็นลูกค้า' },
  { icon: FileText, label: 'Billing', path: '/billing', description: 'จัดการบิล' },
  { icon: Settings, label: 'Settings', path: '/settings', description: 'ตั้งค่าระบบ' },
];

const NavItem = ({ item, isActive, isSidebarCollapsed }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={item.path}
          className={`
            group flex items-center px-4 py-3 mb-1 rounded-lg transition-colors
            ${isActive 
              ? 'bg-white/20 text-yellow-400' 
              : 'text-white hover:bg-white/10'
            }
          `}
        >
          <item.icon className="w-5 h-5" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="ml-3">{item.label}</span>
          )}
          {!isSidebarCollapsed && isActive && (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </Link>
      </TooltipTrigger>
      {isSidebarCollapsed && (
        <TooltipContent side="right">
          <div>
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

const MobileNav = ({ children }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6 text-white" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-64 bg-gradient-to-b from-cyan-500 to-blue-500 p-0">
      {children}
    </SheetContent>
  </Sheet>
);

const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const Sidebar = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h1 className="text-2xl font-bold text-white">
              Thai Bites<br />
              <span className="text-lg font-normal">To-Go</span>
            </h1>
          )}
          {!mobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="text-white hover:bg-white/10"
            >
              {isSidebarCollapsed ? <ChevronRight /> : <X />}
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 mt-4" role="navigation" aria-label="Main Navigation">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavItem
                item={item}
                isActive={location.pathname === item.path}
                isSidebarCollapsed={isSidebarCollapsed && !mobile}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-start text-white hover:bg-white/10"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block bg-white/10 backdrop-blur-lg shadow-lg transition-all ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg">
          <h1 className="text-xl font-bold text-white">Thai Bites To-Go</h1>
          <MobileNav>
            <Sidebar mobile />
          </MobileNav>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-white/5 backdrop-blur-sm p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;