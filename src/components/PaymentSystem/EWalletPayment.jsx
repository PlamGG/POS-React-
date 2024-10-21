import React from 'react';
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';

const EWalletPayment = ({ total, onPaymentComplete }) => {
  const handlePayment = () => {
    onPaymentComplete({
      method: 'e-wallet',
      total: total,
    });
  };

  const qrValue = `https://payment.example.com/pay?amount=${total}&currency=THB`;

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <QRCodeSVG value={qrValue} size={200} />
      </div>
      <p className="text-center">Scan the QR code to pay ฿{total.toFixed(2)}</p>
      <Button onClick={handlePayment} className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-300">
        Confirm E-Wallet Payment
      </Button>
    </div>
  );
};

export default EWalletPayment;