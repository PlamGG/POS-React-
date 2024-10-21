import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import OrderItems from '../Order/OrderItems';
import OrderSummary from '../Order/OrderSummary';
import PaymentSystem from '../PaymentSystem/PaymentSystem';

const POSSidebar = ({
  order,
  showOrderSummary,
  setShowOrderSummary,
  addItemToOrder,
  removeItemFromOrder,
  calculateTotal,
  confirmBill,
  handleApplyDiscount,
  handlePaymentComplete,
  onReturnToMenu
}) => {
  const [showPayment, setShowPayment] = useState(false); // State to control showing payment system

  const handleOpenPayment = () => {
    setShowPayment(true); // Open payment system
  };

  const handlePaymentCompleteWrapper = (paymentDetails) => {
    handlePaymentComplete(paymentDetails);
    setShowPayment(false); // Close payment system after completion
  };

  return (
    <div className="w-full max-w-md bg-gray-100 shadow-xl overflow-y-auto">
      <div className="p-4">
        {showPayment ? (
          <PaymentSystem
            total={order.totalAfterTax || 0}
            order={order}
            onPaymentComplete={handlePaymentCompleteWrapper} // Use wrapper function
            onReturnToMenu={onReturnToMenu}
          />
        ) : showOrderSummary ? (
          <OrderSummary 
            order={order}
            onConfirmBill={confirmBill}
            onBack={() => setShowOrderSummary(false)}
            onApplyDiscount={handleApplyDiscount}
          />
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Current Order</h2>
            <OrderItems 
              order={order} 
              addItemToOrder={addItemToOrder} 
              removeItemFromOrder={removeItemFromOrder}
            />
            {order.items.length > 0 && (
              <Button 
                onClick={calculateTotal} 
                className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
              >
                View Order Summary
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default POSSidebar;
