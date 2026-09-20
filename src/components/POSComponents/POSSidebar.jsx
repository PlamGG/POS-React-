import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import OrderItems from '../Order/OrderItems';
import OrderSummary from '../Order/OrderSummary';
import PaymentSystem from '../PaymentSystem/PaymentSystem';

const POSSidebar = ({
  order,
  showPayment,
  setShowPayment,
  showOrderSummary,
  setShowOrderSummary,
  addItemToOrder,
  removeItemFromOrder,
  deleteItemFromOrder,
  calculateTotal,
  confirmBill,
  handleApplyDiscount,
  handlePaymentComplete,
  onReturnToMenu
}) => {
  const handleOpenPayment = () => {
    setShowPayment(true); // Open payment system
  };

  const handlePaymentCompleteWrapper = (paymentDetails) => {
    handlePaymentComplete(paymentDetails);
    // Keep payment system open so user can see receipt and click Return to Menu
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-white border-l border-gray-100 shadow-2xl h-full flex flex-col shrink-0">
      <div className="flex-1 flex flex-col overflow-hidden">
        {showPayment ? (
          <div className="p-6 h-full overflow-y-auto">
            <PaymentSystem
              total={order.totalAfterTax || 0}
              order={order}
              onPaymentComplete={handlePaymentCompleteWrapper} // Use wrapper function
              onReturnToMenu={onReturnToMenu}
            />
          </div>
        ) : showOrderSummary ? (
          <div className="p-6 h-full overflow-y-auto">
            <OrderSummary 
              order={order}
              onConfirmBill={confirmBill}
              onBack={() => setShowOrderSummary(false)}
              onApplyDiscount={handleApplyDiscount}
            />
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Current Order</h2>
              <p className="text-sm text-gray-400 mt-1">{order.items.length} items</p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50">
              <OrderItems 
                order={order} 
                addItemToOrder={addItemToOrder} 
                removeItemFromOrder={removeItemFromOrder}
                deleteItemFromOrder={deleteItemFromOrder}
              />
            </div>

            <div className="px-6 py-6 border-t border-gray-100 bg-white flex-shrink-0">
              {order.items.length > 0 ? (
                <Button 
                  onClick={calculateTotal} 
                  size="lg"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 py-6 text-lg rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Pay ฿{order.totalAfterTax?.toFixed(2) || '0.00'}
                </Button>
              ) : (
                <div className="text-center text-gray-400 py-4 border-2 border-dashed border-gray-200 rounded-xl">
                  Cart is empty
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default POSSidebar;
