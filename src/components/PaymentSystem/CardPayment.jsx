import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CardPayment = ({ total, onPaymentComplete }) => {
  const [cardNumber, setCardNumber] = useState('');

  const handlePayment = () => {
    const lastFour = cardNumber.slice(-4);
    onPaymentComplete({
      method: 'card',
      total: total,
      lastFour: lastFour,
    });
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="bg-white/20"
      />
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="MM/YY"
          className="bg-white/20 w-1/2"
        />
        <Input
          type="text"
          placeholder="CVV"
          className="bg-white/20 w-1/2"
        />
      </div>
      <Button onClick={handlePayment} className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-300">
        Complete Card Payment
      </Button>
    </div>
  );
};

export default CardPayment;