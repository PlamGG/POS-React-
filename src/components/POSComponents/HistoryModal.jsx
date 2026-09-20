import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTransactions, useVoidTransaction } from '../../hooks/useTransactions';

const HistoryModal = ({ open, onOpenChange }) => {
  const { data: transactions = [], isLoading } = useTransactions();
  const { mutate: voidTransaction, isPending: isVoiding } = useVoidTransaction();

  // Filter only today's transactions
  const today = new Date().toDateString();
  const todaysTransactions = transactions.filter(t => new Date(t.created_at).toDateString() === today);

  const handleVoid = (id) => {
    if (window.confirm("Are you sure you want to void this bill? Stock will be refunded automatically.")) {
      voidTransaction(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Today's Transaction History</DialogTitle>
          <DialogDescription>View all orders made today or void mistakes to refund stock.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : todaysTransactions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No transactions today yet.</div>
        ) : (
          <div className="space-y-4 mt-4">
            {todaysTransactions.map((txn) => (
              <div key={txn.id} className={`p-4 border rounded-lg ${txn.status === 'voided' ? 'bg-red-50/50 border-red-200' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">Order #{txn.order_number}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(txn.created_at).toLocaleTimeString()} - {txn.payment_method.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">฿{Number(txn.total).toFixed(2)}</p>
                    {txn.status === 'voided' ? (
                      <Badge variant="destructive" className="mt-1">VOIDED</Badge>
                    ) : (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="mt-1"
                        onClick={() => handleVoid(txn.id)}
                        disabled={isVoiding}
                      >
                        Void & Refund
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-2 mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {txn.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                            <span className="text-gray-400 text-xs ml-2">
                              (+{item.selectedModifiers.map(m => m.name).join(', ')})
                            </span>
                          )}
                          {item.itemNote && (
                            <span className="text-orange-500 text-xs ml-2 italic">
                              (Note: {item.itemNote})
                            </span>
                          )}
                        </span>
                        <span>฿{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
