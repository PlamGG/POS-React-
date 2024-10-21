import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const POSHeader = () => {
  const [dailyCashBalance, setDailyCashBalance] = useState(0);
  const showLowCashAlert = dailyCashBalance < 10000; 

  useEffect(() => {
    const storedCash = localStorage.getItem('storeCashBalance');
    if (storedCash) {
      setDailyCashBalance(parseFloat(storedCash));
    }
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Daily Cash Balance: ฿{dailyCashBalance.toFixed(2)}</h2>
        {showLowCashAlert && (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Cash Alert</AlertTitle>
            <AlertDescription>Cash balance is below ฿10,000</AlertDescription>
          </Alert>
        )}
      </div>
    </header>
  );
};

export default POSHeader;
