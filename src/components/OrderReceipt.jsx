import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Store } from 'lucide-react';
import ReceiptPrinter from './PaymentSystem/ReceiptPrinter'; // Assuming ReceiptPrinter is in the same directory

const OrderReceipt = ({ order }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Extract payment details from order prop
  const paymentDetails = order && order.paymentMethod ? {
    paymentMethod: order.paymentMethod,
    amountPaid: order.amountPaid,
    changeGiven: order.changeGiven,
    transactionId: order.transactionId || order.id, // Use transactionId if available, else fallback to order.id
    cardDetails: order.cardDetails, // Include cardDetails if present
    eWalletDetails: order.eWalletDetails, // Include eWalletDetails if present
  } : {
    // Default or placeholder if payment details are not in order
    paymentMethod: "N/A",
    amountPaid: order && order.totalAfterTax ? order.totalAfterTax : 0,
    changeGiven: 0,
    transactionId: order && order.id ? order.id : "N/A"
  };

  if (!order || !order.items) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">No Order Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">There is no order to display.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Store className="mr-2" /> Order Receipt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-lg">
                <span>{item.name} x{item.quantity}</span>
                <span>฿{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>฿{order.totalAfterTax.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {/* ปุ่มพิมพ์ */}
          <Button onClick={handlePrint} className="mt-6 w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500 no-print">
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button>
        </CardContent>
      </Card>
      <div style={{ display: 'none' }}>
        <ReceiptPrinter ref={componentRef} order={order} paymentDetails={paymentDetails} />
      </div>
    </div>
  );
};

export default OrderReceipt;
