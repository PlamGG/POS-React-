import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import POS from './pages/POS';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import OrderReceipt from './pages/OrderReceipt';
import StockManagement from './pages/StockManagement';
import FoodCostManagement from './pages/FoodCostManagement';
import CustomerFeedback from './pages/CustomerFeedback';
import BillingManagement from './pages/BillingManagement';
import PublicFeedback from './pages/PublicFeedback';

import { supabase } from './services/supabase';

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = React.useState(null);
  const [isLoadingSession, setIsLoadingSession] = React.useState(true);
  const [currentOrder, setCurrentOrder] = React.useState(null);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleOrderComplete = (order) => {
    setCurrentOrder(order);
  };

  if (isLoadingSession) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-100">Loading...</div>;
  }

  const isLoggedIn = !!session;

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
                  <Login />
                )
              } 
            />
            <Route path="/feedback" element={<PublicFeedback />} />
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