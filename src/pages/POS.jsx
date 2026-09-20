import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import OrderItems from '../components/Order/OrderItems';
import MenuItemList from '../components/Order/MenuItemList';
import CategorySelector from '../components/CategorySelector';
import PaymentSystem from '../components/PaymentSystem/PaymentSystem';
import { calculateOrderTotal, updateInventory, filterMenuItems, applyPromotion } from '../utils/orderUtils';
import POSHeader from '../components/POSComponents/POSHeader';
import POSSidebar from '../components/POSComponents/POSSidebar';
import { useCartStore } from '../store/useCartStore';
import { useProducts } from '../hooks/useProducts';
import { useAddTransaction } from '../hooks/useTransactions';
import { usePromotions } from '../hooks/usePromotions';
import { usePOSStore } from '../store/usePOSStore';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

const POS = ({ onOrderComplete }) => {
  const { order, addItem, removeItem, deleteItem, clearCart, applyDiscount } = useCartStore();
  const { data: inventory = [], isLoading: isLoadingProducts } = useProducts();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { data: promotions = [] } = usePromotions();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState(null);
  const { dailyOrderCount, dailyCashBalance, checkAndResetDailyStats, incrementOrderCount, updateCashBalance } = usePOSStore();
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showLowCashAlert, setShowLowCashAlert] = useState(false);
  const [cashReceived, setCashReceived] = useState(0);
  const [changeDue, setChangeDue] = useState(0);

  useEffect(() => {
    checkAndResetDailyStats();
  }, [checkAndResetDailyStats]);

  useEffect(() => {
    setShowLowCashAlert(dailyCashBalance < 10000);
  }, [dailyCashBalance]);

  const addItemToOrder = useCallback((item, modifiers = [], itemNote = '') => {
    addItem(item, modifiers, itemNote);
  }, [addItem]);

  const removeItemFromOrder = useCallback((cartItemId) => {
    removeItem(cartItemId);
  }, [removeItem]);

  const deleteItemFromOrder = useCallback((cartItemId) => {
    deleteItem(cartItemId);
  }, [deleteItem]);

  const calculateTotal = useCallback(() => {
    setShowOrderSummary(true);
  }, []);

  const confirmBill = () => {
    setShowPayment(true);
    setShowOrderSummary(false);
  };

  const handleApplyDiscount = (discountCode) => {
    applyDiscount(discountCode, promotions);
  };

  const handlePaymentComplete = async (paymentDetails) => {
    incrementOrderCount();
    const newCount = dailyOrderCount + 1;

    if (paymentDetails.method === 'cash' || paymentDetails.method === 'split') {
      const cashAmount = paymentDetails.method === 'cash' ? paymentDetails.amount : paymentDetails.cashAmount;
      updateCashBalance(cashAmount || 0);
      setCashReceived(cashAmount || 0);
      setChangeDue(paymentDetails.change || 0);
    }

    const orderData = {
      orderNumber: newCount,
      total: order.totalAfterTax || 0,
      payment_method: paymentDetails.method,
      amount_paid: paymentDetails.amount || paymentDetails.cashAmount || order.totalAfterTax,
      change: paymentDetails.change || 0,
      items: order.items,
    };

    // Save to backend using React Query Mutation
    try {
      const savedTransaction = await addTransaction(orderData);
      onOrderComplete(savedTransaction);
      setShowPayment(true);
      clearCart();
    } catch (error) {
      console.error("Failed to save transaction", error);
      alert("Failed to save transaction. Please try again.");
    }
  };

  const handleReturnToMenu = () => {
    clearCart();
    setShowPayment(false);
    setShowOrderSummary(false);
  };

  if (isLoadingProducts) {
    return <div className="flex items-center justify-center h-screen">Loading Products...</div>;
  }

  return (
    <div className="flex h-full w-full min-w-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm relative">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <POSHeader dailyCashBalance={dailyCashBalance} showLowCashAlert={showLowCashAlert} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          {lowStockAlert && <div className="m-4 text-red-600">Stock Alert: {lowStockAlert}</div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!showOrderSummary && !showPayment && (
              <>
                <CategorySelector
                  menuItems={inventory}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
                <MenuItemList
                  filteredMenuItems={filterMenuItems(inventory, selectedCategory, searchTerm)}
                  addItemToOrder={addItemToOrder}
                />
              </>
            )}
            {showPayment && (
              <PaymentSystem
                total={order.totalAfterTax || 0}
                order={order}
                onPaymentComplete={handlePaymentComplete}
                onReturnToMenu={handleReturnToMenu}
              />
            )}
          </div>
        </main>
      </div>

      {/* Desktop Sidebar (lg: 1024px and up) */}
      <div className="hidden lg:flex z-10 relative shadow-2xl shrink-0">
        <POSSidebar
          order={order}
          showPayment={showPayment}
          showOrderSummary={showOrderSummary}
          setShowOrderSummary={setShowOrderSummary}
          addItemToOrder={addItemToOrder}
          removeItemFromOrder={removeItemFromOrder}
          deleteItemFromOrder={deleteItemFromOrder}
          calculateTotal={calculateTotal}
          confirmBill={confirmBill}
          handleApplyDiscount={handleApplyDiscount}
          cashReceived={cashReceived}
          changeDue={changeDue}
          onReturnToMenu={handleReturnToMenu}
        />
      </div>

      {/* Mobile/Tablet Portrait Cart Button & Sheet (< 1024px) */}
      <div className="lg:hidden absolute bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="h-16 w-16 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 relative">
              <ShoppingCart className="h-7 w-7 text-white" />
              {order.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center border-2 border-white">
                  {order.items.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[450px] p-0 border-l-0">
            <POSSidebar
              order={order}
              showPayment={showPayment}
              showOrderSummary={showOrderSummary}
              setShowOrderSummary={setShowOrderSummary}
              addItemToOrder={addItemToOrder}
              removeItemFromOrder={removeItemFromOrder}
              deleteItemFromOrder={deleteItemFromOrder}
              calculateTotal={calculateTotal}
              confirmBill={confirmBill}
              handleApplyDiscount={handleApplyDiscount}
              cashReceived={cashReceived}
              changeDue={changeDue}
              onReturnToMenu={handleReturnToMenu}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default POS;
