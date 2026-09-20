import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ReceiptPrinter = forwardRef(({ paymentDetails, order, storeSettings }, ref) => {
  if (!paymentDetails || !order) return null;

  const formatAmount = (amount) => typeof amount === 'number' ? amount.toFixed(2) : 'N/A';
  const feedbackUrl = `${window.location.origin}/feedback?tx=${paymentDetails.transactionId || 'UNKNOWN'}`;

  return (
    <div ref={ref} className="p-4 bg-white text-black rounded-md" style={{ width: '300px', fontFamily: 'monospace' }}>
      <h1 className="text-2xl font-bold text-center mb-1">{storeSettings?.store_name || 'My Cafe'}</h1>
      <h2 className="text-md text-center mb-2 font-semibold">Receipt</h2>
      <p className="text-center text-xs text-gray-500 mb-4">{new Date(paymentDetails.timestamp).toLocaleString()}</p>
      
      <div className="mb-4 text-xs">
        <p><span className="font-semibold">TX #:</span> {paymentDetails.transactionId}</p>
      </div>

      <table className="w-full mb-4 text-sm">
        <thead className="border-b border-dashed">
          <tr>
            <th className="text-left pb-2">ITEM</th>
            <th className="text-right pb-2">PRICE</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="pt-2">
                  {item.quantity}x {item.name}
                </td>
                <td className="text-right pt-2">฿{formatAmount(item.price * item.quantity)}</td>
              </tr>
              {item.selectedModifiers?.length > 0 && (
                <tr>
                  <td colSpan={2} className="text-xs text-gray-500 pl-4">
                    +{item.selectedModifiers.map(m => m.name).join(', ')}
                  </td>
                </tr>
              )}
              {item.itemNote && (
                <tr>
                  <td colSpan={2} className="text-xs text-gray-500 pl-4 italic">
                    Note: {item.itemNote}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed pt-2 text-sm">
        <p className="flex justify-between"><span>SUBTOTAL</span><span>฿{formatAmount(order.totalAfterTax + (order.discountAmount || 0))}</span></p>
        {order.discountAmount > 0 && (
          <p className="flex justify-between text-green-600"><span>DISCOUNT</span><span>-฿{formatAmount(order.discountAmount)}</span></p>
        )}
        <p className="flex justify-between font-bold text-lg pt-1"><span>TOTAL</span><span>฿{formatAmount(order.totalAfterTax)}</span></p>
      </div>

      <div className="border-t border-dashed pt-4 text-xs mb-4">
        <p><span className="font-semibold">Payment:</span> {paymentDetails.method}</p>
        {paymentDetails.method === 'cash' && (
          <>
            <p><span className="font-semibold">Received:</span> ฿{formatAmount(paymentDetails.amountPaid)}</p>
            <p><span className="font-semibold">Change:</span> ฿{formatAmount(paymentDetails.change)}</p>
          </>
        )}
      </div>

      <div className="text-center text-xs text-gray-600 mt-6 space-y-4">
        <p className="font-bold">{storeSettings?.receipt_footer || 'Thank you for your business!'}</p>
        
        <div className="flex flex-col items-center justify-center">
          <p className="text-[10px] mb-2">Scan to give us feedback!</p>
          <QRCodeSVG value={feedbackUrl} size={100} />
        </div>
      </div>
    </div>
  );
});

ReceiptPrinter.displayName = 'ReceiptPrinter';
export default ReceiptPrinter;
