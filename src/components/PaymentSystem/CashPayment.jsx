import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CashPayment = ({ total, onPaymentComplete }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);

  const handlePayment = () => {
    const paid = parseFloat(amountPaid);
    if (paid >= total) {
      const changeAmount = paid - total;
      setChange(changeAmount);
      onPaymentComplete({
        method: 'cash',
        amountPaid: paid,
        total: total,
        change: changeAmount,
      });
    } else {
      alert("Insufficient payment amount");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="number"
        value={amountPaid}
        onChange={(e) => setAmountPaid(e.target.value)}
        placeholder="Enter amount paid"
        className="bg-white/20"
      />
      <Button onClick={handlePayment} className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-300">
        Complete Cash Payment
      </Button>
      {change > 0 && (
        <div className="text-lg font-semibold">
          Change: ฿{change.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default CashPayment;