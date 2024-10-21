import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrderSummary = ({ order, total }) => {
  return (
    <Card className="bg-white/10">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>฿{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>฿{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (0%)</span>
              <span>฿{order.tax?.toFixed(2) || '0.00'}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-300">
                <span>Discount</span>
                <span>-฿{order.discountAmount?.toFixed(2) || '0.00'}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2 border-t border-white/20 pt-2">
              <span>Total to Pay</span>
              <span>฿{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;