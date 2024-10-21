import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Home,
  CreditCard,
  Wallet,
  Banknote,
  Clock,
  RefreshCcw
} from 'lucide-react';
import CashPayment from './CashPayment';
import CardPayment from './CardPayment';
import EWalletPayment from './EWalletPayment';
import ReceiptPrinter from './ReceiptPrinter';
import { useReactToPrint } from 'react-to-print';
import OrderSummary from './OrderSummary';

const PaymentSystem = ({ total, order, onPaymentComplete, onReturnToMenu }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handlePaymentComplete = async (details) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() < 0.9;
    setPaymentStatus(success);
    setIsProcessing(false);
    
    if (success) {
      const completeDetails = { 
        ...details, 
        method: paymentMethod, 
        timestamp: new Date().toISOString(),
        amountWithdrawn: total,
        transactionId: Math.random().toString(36).substr(2, 9).toUpperCase()
      };
      setPaymentDetails(completeDetails);
      onPaymentComplete(completeDetails);
    }
  };

  const handleTryAgain = () => {
    setPaymentStatus(null);
    setPaymentDetails(null);
  };

  return (
    <Card className="max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>Payment</span>
          <span className="text-3xl font-bold">฿{total.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <OrderSummary order={order} total={total} />
        </div>
        
        {paymentStatus === null && !isProcessing && (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-gray-700 mb-2">Select Payment Method</div>
            <Select onValueChange={setPaymentMethod} defaultValue={paymentMethod}>
              <SelectTrigger className="w-full border-2 border-blue-100 hover:border-blue-200 transition-colors">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash" className="flex items-center py-3">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </div>
                </SelectItem>
                <SelectItem value="card" className="flex items-center py-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit/Debit Card</span>
                  </div>
                </SelectItem>
                <SelectItem value="e-wallet" className="flex items-center py-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>E-Wallet</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="bg-white rounded-lg border-2 border-blue-100 p-4 mt-4">
              {paymentMethod === 'cash' && <CashPayment total={total} onPaymentComplete={handlePaymentComplete} />}
              {paymentMethod === 'card' && <CardPayment total={total} onPaymentComplete={handlePaymentComplete} />}
              {paymentMethod === 'e-wallet' && <EWalletPayment total={total} onPaymentComplete={handlePaymentComplete} />}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
            <div className="text-lg font-semibold text-gray-700">Processing payment...</div>
            <div className="text-sm text-gray-500 mt-2">Please wait a moment</div>
          </div>
        )}

        {paymentStatus !== null && (
          <div className="space-y-4">
            <Alert 
              variant={paymentStatus ? "default" : "destructive"} 
              className={`border-2 ${paymentStatus ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
            >
              <div className="flex items-center gap-2">
                {paymentStatus ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <AlertTitle className="text-lg">
                  {paymentStatus ? "Payment Successful" : "Payment Failed"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {paymentStatus ? (
                  <div className="space-y-2">
                    <p>Payment amount of ฿{total.toFixed(2)} was successful</p>
                    <p className="text-sm text-gray-600">
                      Payment method: {paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'card' ? 'Card' : 'E-Wallet'}
                    </p>
                    {paymentDetails?.transactionId && (
                      <p className="text-sm text-gray-600">
                        Transaction ID: {paymentDetails.transactionId}
                      </p>
                    )}
                  </div>
                ) : (
                  "There was an error processing the payment. Please try again."
                )}
              </AlertDescription>
            </Alert>

            {!paymentStatus && (
              <Button 
                onClick={handleTryAgain} 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-12"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        )}

        {paymentDetails && (
          <div className="space-y-4 pt-4 border-t">
            <div style={{ display: 'none' }}>
              <ReceiptPrinter ref={receiptRef} paymentDetails={paymentDetails} order={order} />
            </div>
            
            <Button 
              onClick={handlePrint} 
              className="w-full bg-green-500 hover:bg-green-600 text-white h-12"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            
            <Button 
              onClick={onReturnToMenu} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Main Menu
            </Button>

            
            <div className="mt-4 flex justify-center items-center ">
              <ReceiptPrinter ref={receiptRef} paymentDetails={paymentDetails} order={order} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSystem;
