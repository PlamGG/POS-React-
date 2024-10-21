import React, { forwardRef } from 'react';

const ReceiptPrinter = forwardRef(({ paymentDetails, order }, ref) => {
  if (!paymentDetails || !order) return null;

  const formatAmount = (amount) => {
    return typeof amount === 'number' ? amount.toFixed(2) : 'N/A';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div ref={ref} className="p-4 bg-white text-black shadow-lg rounded-md" style={{ width: '300px', fontFamily: 'monospace' }}>
      <h1 className="text-3xl font-bold text-center mb-2">Thai Bites To-Go</h1>
      <h2 className="text-lg text-center mb-2 font-semibold">Sales Receipt</h2>
      <p className="text-center text-sm text-gray-500 mb-4">{formatDate(paymentDetails.timestamp)}</p>
      
      <div className="mb-4 text-sm">
        <p><span className="font-semibold">TICKET #:</span> {Math.floor(Math.random() * 1000000)}</p>
        <p><span className="font-semibold">Location:</span> Thai Bites To-Go 1 </p>
        <p><span className="font-semibold">Employee:</span>james bond</p>
      </div>

      <table className="w-full mb-4 text-sm">
        <thead className="border-b">
          <tr>
            <th className="text-left pb-2">ITEM</th>
            <th className="text-center pb-2">QTY</th>
            <th className="text-right pb-2">PRICE</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td className="pt-2">{item.name}</td>
              <td className="text-center pt-2">{item.quantity}</td>
              <td className="text-right pt-2">฿{formatAmount(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t pt-2 text-sm">
        <p className="flex justify-between"><span>SUBTOTAL</span><span>฿{formatAmount(order.subtotal)}</span></p>
        <p className="flex justify-between"><span>TAX (7%)</span><span>฿{formatAmount(order.tax)}</span></p>
        <p className="flex justify-between font-bold text-lg"><span>TOTAL</span><span>฿{formatAmount(order.totalAfterTax)}</span></p>
      </div>

      <div className="border-t pt-4 text-sm mb-4">
        <p><span className="font-semibold">Payment Method:</span> {paymentDetails.method}</p>
        <p><span className="font-semibold">Amount Withdrawn:</span> ฿{formatAmount(paymentDetails.amountWithdrawn)}</p>
        {paymentDetails.method === 'cash' && (
          <>
            <p><span className="font-semibold">Cash Received:</span> ฿{formatAmount(paymentDetails.amountPaid)}</p>
            <p><span className="font-semibold">Change:</span> ฿{formatAmount(paymentDetails.change)}</p>
          </>
        )}
        {paymentDetails.method === 'card' && (
          <>
            <p><span className="font-semibold">Card Number:</span> XXXX-XXXX-XXXX-{paymentDetails.lastFour}</p>
            <p><span className="font-semibold">Approval:</span> {Math.floor(Math.random() * 100000)}</p>
          </>
        )}
        {paymentDetails.method === 'e-wallet' && (
          <p><span className="font-semibold">E-Wallet Transaction ID:</span> {Math.random().toString(36).substr(2, 9)}</p>
        )}
      </div>

      <div className="text-center text-xs text-gray-600">
        <p className="font-bold mb-1">RETURN POLICY</p>
        <p className="mb-1">NO REFUNDS OR EXCHANGES</p>
        <p className="mb-2">ON FOOD ITEMS</p>
        <p className="font-bold">THANK YOU FOR YOUR BUSINESS!</p>
      </div>
    </div>
  );
});

ReceiptPrinter.displayName = 'ReceiptPrinter';

export default ReceiptPrinter;
