import React from 'react';
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { useStoreSettings } from '../../hooks/useStoreSettings';

const EWalletPayment = ({ total, onPaymentComplete }) => {
  const { data: storeSettings } = useStoreSettings();

  const handlePayment = () => {
    onPaymentComplete({
      method: 'promptpay',
      total: total,
    });
  };

  const promptpayId = storeSettings?.promptpay_id || '0800000000';
  const qrValue = generatePayload(promptpayId, { amount: total });

  return (
    <div className="space-y-4">
      <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-blue-50">
        <QRCodeSVG value={qrValue} size={256} />
      </div>
      <p className="text-center font-medium text-lg text-blue-800">
        Scan to pay ฿{total.toFixed(2)}
      </p>
      <p className="text-center text-sm text-gray-500 mb-4">
        PromptPay: {promptpayId}
      </p>
      <Button onClick={handlePayment} className="w-full bg-blue-600 text-white hover:bg-blue-700 h-12 text-lg">
        Confirm PromptPay Payment
      </Button>
    </div>
  );
};

export default EWalletPayment;