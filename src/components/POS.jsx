import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import OrderItems from './Order/OrderItems';
import MenuItemList from './Order/MenuItemList';
import CategorySelector from './CategorySelector';
import PaymentSystem from './PaymentSystem/PaymentSystem';
import { calculateOrderTotal, updateInventory, filterMenuItems, applyPromotion } from '../utils/orderUtils';
import { menuItems } from '../data/menuItems';
import POSHeader from './POSComponents/POSHeader';
import POSSidebar from './POSComponents/POSSidebar';

const POS = ({ onOrderComplete }) => {
  const [order, setOrder] = useState({ items: [], totalAfterTax: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(menuItems);
  const [lowStockAlert, setLowStockAlert] = useState(null);
  const [dailyOrderCount, setDailyOrderCount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [dailyCashBalance, setDailyCashBalance] = useState(0);
  const [showLowCashAlert, setShowLowCashAlert] = useState(false);
  const [cashReceived, setCashReceived] = useState(0);
  const [changeDue, setChangeDue] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedCount = localStorage.getItem(`dailyOrderCount_${today}`);
    setDailyOrderCount(storedCount ? parseInt(storedCount) : 0);

    const storedBalance = localStorage.getItem(`dailyCashBalance_${today}`);
    setDailyCashBalance(storedBalance ? parseFloat(storedBalance) : parseFloat(localStorage.getItem('storeCashBalance')) || 0);
  }, []);

  useEffect(() => {
    setShowLowCashAlert(dailyCashBalance < 10000);
  }, [dailyCashBalance]);

  const addItemToOrder = useCallback((item) => {
    if (item.stock > 0) {
      setOrder(prevOrder => {
        const existingItem = prevOrder.items.find(i => i.id === item.id);
        const updatedItems = existingItem
          ? prevOrder.items.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prevOrder.items, { ...item, quantity: 1 }];

        return { ...prevOrder, items: updatedItems };
      });
      setInventory(prevInventory => updateInventory(prevInventory, item.id, -1));
    } else {
      setLowStockAlert(`${item.name} is out of stock!`);
    }
  }, []);

  const removeItemFromOrder = useCallback((itemId) => {
    setOrder(prevOrder => {
      const updatedItems = prevOrder.items.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          setInventory(prevInventory => updateInventory(prevInventory, itemId, 1));
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

      return { ...prevOrder, items: updatedItems };
    });
  }, []);

  const calculateTotal = useCallback(() => {
    const calculatedOrder = calculateOrderTotal(order);
    setOrder(calculatedOrder);
    setShowOrderSummary(true);
  }, [order]);

  const confirmBill = () => {
    setShowPayment(true);
    setShowOrderSummary(false);
  };

  const handleApplyDiscount = (discountCode) => {
    const discountedOrder = applyPromotion(order, discountCode);
    setOrder(discountedOrder);
  };

  const handlePaymentComplete = (paymentDetails) => {
    const newCount = dailyOrderCount + 1;
    setDailyOrderCount(newCount);
    const today = new Date().toDateString();
    localStorage.setItem(`dailyOrderCount_${today}`, newCount.toString());

    if (paymentDetails.method === 'cash' || paymentDetails.method === 'split') {
      const cashAmount = paymentDetails.method === 'cash' ? paymentDetails.amount : paymentDetails.cashAmount;
      const newBalance = dailyCashBalance + (cashAmount || 0);
      setDailyCashBalance(newBalance);
      localStorage.setItem(`dailyCashBalance_${today}`, newBalance.toString());
      setCashReceived(cashAmount || 0);
      setChangeDue(paymentDetails.change || 0);
    }

    const orderData = {
      id: Date.now().toString(),
      orderNumber: newCount,
      timestamp: new Date().toISOString(),
      items: order.items,
      total: order.totalAfterTax || 0,
      orderType: 'take-away',
      ...paymentDetails,
    };

    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    localStorage.setItem('transactions', JSON.stringify([orderData, ...existingTransactions]));

    onOrderComplete(orderData);
    setShowPayment(true);
  };

  const handleReturnToMenu = () => {
    setOrder({ items: [], totalAfterTax: 0 });
    setShowPayment(false);
    setShowOrderSummary(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <POSHeader dailyCashBalance={dailyCashBalance} showLowCashAlert={showLowCashAlert} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {lowStockAlert && <div className="m-4 text-red-600">Stock Alert: {lowStockAlert}</div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!showOrderSummary && !showPayment && (
              <>
                <CategorySelector
                  menuItems={menuItems}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
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
      <div className="hidden lg:flex">
        <POSSidebar
          order={order}
          showPayment={showPayment}
          showOrderSummary={showOrderSummary}
          setShowOrderSummary={setShowOrderSummary}
          addItemToOrder={addItemToOrder}
          removeItemFromOrder={removeItemFromOrder}
          calculateTotal={calculateTotal}
          confirmBill={confirmBill}
          handleApplyDiscount={handleApplyDiscount}
          cashReceived={cashReceived}
          changeDue={changeDue}
        />
      </div>
      <div className="flex lg:hidden">
        <POSSidebar
          order={order}
          showPayment={showPayment}
          showOrderSummary={showOrderSummary}
          setShowOrderSummary={setShowOrderSummary}
          addItemToOrder={addItemToOrder}
          removeItemFromOrder={removeItemFromOrder}
          calculateTotal={calculateTotal}
          confirmBill={confirmBill}
          handleApplyDiscount={handleApplyDiscount}
          cashReceived={cashReceived}
          changeDue={changeDue}
        />
      </div>
    </div>
  );
};

export default POS;
