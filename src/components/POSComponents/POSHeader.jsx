import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

import HistoryModal from './HistoryModal';
import { Button } from "@/components/ui/button";
import { History } from 'lucide-react';

const POSHeader = () => {
  const [dailyCashBalance, setDailyCashBalance] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const showLowCashAlert = dailyCashBalance < 10000; 

  useEffect(() => {
    const storedCash = localStorage.getItem('storeCashBalance');
    if (storedCash) {
      setDailyCashBalance(parseFloat(storedCash));
    }
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            History & Void
          </Button>
          <h2 className="text-lg font-semibold text-gray-700 hidden sm:block">
            Cash Drawer: ฿{dailyCashBalance.toFixed(2)}
          </h2>
        </div>
        
        {showLowCashAlert && (
          <Alert variant="destructive" className="w-auto py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Low Cash Alert</AlertTitle>
          </Alert>
        )}
      </div>

      <HistoryModal open={showHistory} onOpenChange={setShowHistory} />
    </header>
  );
};

export default POSHeader;
