import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle } from 'lucide-react';

const ReceiptModal = ({ open, onClose, order, paymentDetails, transactionId, storeSettings }) => {
  if (!order || order.items.length === 0) return null;

  // Use window.location.origin for the current domain
  const feedbackUrl = `${window.location.origin}/feedback?tx=${transactionId}`;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" hideCloseButton>
        <DialogHeader>
          <div className="flex flex-col items-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
            <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="receipt-content bg-white p-4 border rounded-sm text-sm" id="receipt-print-area">
          <div className="text-center mb-4 border-b pb-4 border-dashed">
            <h2 className="font-bold text-lg">{storeSettings?.store_name || 'My Cafe'}</h2>
            <p className="text-xs text-gray-500">Receipt #{transactionId?.slice(0,8).toUpperCase()}</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.quantity}x {item.name}</span>
                  {item.selectedModifiers?.length > 0 && (
                    <div className="text-xs text-gray-500 pl-4">
                      {item.selectedModifiers.map(m => `+${m.name}`).join(', ')}
                    </div>
                  )}
                  {item.itemNote && (
                    <div className="text-xs text-gray-500 pl-4 italic">
                      Note: {item.itemNote}
                    </div>
                  )}
                </div>
                <span>฿{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed pt-2 space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>฿{(order.totalAfterTax + (order.discountAmount || 0)).toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-฿{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2">
              <span>Total</span>
              <span>฿{order.totalAfterTax.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed mt-4 pt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Paid via: {paymentDetails?.method}</p>
            {paymentDetails?.method === 'cash' && (
              <div className="text-xs text-gray-500 mb-2">
                Received: ฿{paymentDetails?.amountGiven?.toFixed(2)} | Change: ฿{paymentDetails?.changeDue?.toFixed(2)}
              </div>
            )}
            
            <p className="text-xs font-medium mb-4">{storeSettings?.receipt_footer || 'Thank you!'}</p>

            {transactionId && (
              <div className="flex flex-col items-center justify-center pt-2">
                <p className="text-[10px] text-gray-500 mb-1">Scan to give us feedback!</p>
                <QRCodeSVG value={feedbackUrl} size={80} />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" className="w-full" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print Receipt
          </Button>
          <Button className="w-full bg-blue-600" onClick={onClose}>
            New Order
          </Button>
        </DialogFooter>
      </DialogContent>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-print-area, #receipt-print-area * {
            visibility: visible;
          }
          #receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            padding: 0;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default ReceiptModal;
