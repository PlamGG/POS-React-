import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CashManagement = () => {
  const [storeCash, setStoreCash] = useState(0); // State สำหรับยอดเงินในร้าน
  const showAlert = storeCash < 10000; // ตรวจสอบว่ามียอดเงินน้อยกว่า 10,000 บาทหรือไม่

  // ฟังก์ชันเพื่อบันทึกยอดเงินลงใน localStorage
  const handleSetCash = () => {
    localStorage.setItem('storeCashBalance', storeCash.toString());
  };

  // ฟังก์ชันเพื่อดึงข้อมูลจาก localStorage เมื่อคอมโพเนนต์ถูกติดตั้ง
  useEffect(() => {
    const storedCash = localStorage.getItem('storeCashBalance');
    if (storedCash) {
      setStoreCash(parseFloat(storedCash));
    }
  }, []);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">Cash Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={storeCash}
              onChange={(e) => setStoreCash(parseFloat(e.target.value))}
              className="bg-gray-100"
            />
            <Button onClick={handleSetCash} className="bg-blue-500 text-white">Set Store Cash</Button>
          </div>
          {showAlert && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Low Cash Alert</AlertTitle>
              <AlertDescription>
                Store cash is below ฿10,000. Please add more cash to the register.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CashManagement;
