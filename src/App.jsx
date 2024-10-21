import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import POS from './components/POS';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Login from './components/Login';
import OrderReceipt from './components/OrderReceipt';
import StockManagement from './components/StockManagement';
import FoodCostManagement from './components/FoodCostManagement';
import CustomerFeedback from './components/CustomerFeedback';
import BillingManagement from './components/BillingManagement';

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    // ตรวจสอบสถานะการล็อกอินจาก localStorage
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [currentOrder, setCurrentOrder] = React.useState(null);

  // ฟังก์ชันเมื่อผู้ใช้ล็อกอิน
  const handleLogin = () => {
    setIsLoggedIn(true);
    // บันทึกสถานะการล็อกอินใน localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  // ฟังก์ชันเมื่อผู้ใช้ล็อกเอาท์
  const handleLogout = () => {
    setIsLoggedIn(false);
    // ลบสถานะการล็อกอินออกจาก localStorage
    localStorage.removeItem('isLoggedIn');
  };

  const handleOrderComplete = (order) => {
    setCurrentOrder(order);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route
              path="*"
              element={
                isLoggedIn ? (
                  <Layout onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={<POS onOrderComplete={handleOrderComplete} />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/receipt" element={<OrderReceipt order={currentOrder} />} />
                      <Route path="/stock" element={<StockManagement />} />
                      <Route path="/food-cost" element={<FoodCostManagement />} />
                      <Route path="/customer-feedback" element={<CustomerFeedback />} />
                      <Route path="/billing" element={<BillingManagement />} />
                    </Routes>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};


export default App;