import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderSummary = ({ order, onConfirmBill, onBack, onApplyDiscount }) => {
  const [discountCode, setDiscountCode] = useState('');

  const handleApplyDiscount = () => {
    if (discountCode) {
      onApplyDiscount(discountCode);
      setDiscountCode('');
    }
  };

  return (
    <div className="max-w-full px-4 sm:max-w-md mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order Summary</span>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Ordered Items:</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{item.name} <Badge variant="outline">x{item.quantity}</Badge></span>
                  <span className="font-medium">฿{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>฿{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (0%)</span>
                <span>฿{order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-฿{order.discountAmount?.toFixed(2) || '0.00'}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg mt-2 border-t pt-2">
                <span>Total</span>
                <span>฿{order.totalAfterTax?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <Input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 mb-2 sm:mb-0"
              />
              <Button onClick={handleApplyDiscount} disabled={!discountCode} className="w-full sm:w-auto">
                Apply
              </Button>
            </div>

            <Button 
              className="w-full bg-blue-500 text-white hover:bg-blue-600" 
              onClick={onConfirmBill}
              disabled={order.items.length === 0} // Disable if no items in order
            >
              Proceed to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
