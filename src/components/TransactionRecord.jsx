import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Download, Search, FilterX } from 'lucide-react';

const TransactionRecord = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all'); 
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 25;

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(storedTransactions);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.orderNumber?.toString().includes(searchTerm) ||
      transaction.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = selectedDate 
      ? new Date(transaction.timestamp).toLocaleDateString() === selectedDate.toLocaleDateString() 
      : true;

    const matchesPayment = paymentFilter === 'all' 
      ? true 
      : transaction.paymentMethod === paymentFilter;

    return matchesSearch && matchesDate && matchesPayment;
  }).sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    const comparison = sortConfig.direction === 'asc' ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? comparison : -comparison;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedDate(null);
    setPaymentFilter('all'); 
    setSortConfig({ key: 'timestamp', direction: 'desc' });
  };

  const exportToCSV = () => {
    const headers = ['Order #', 'Date & Time', 'Total', 'Payment Method', 'Amount Paid', 'Change'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.orderNumber,
        new Date(t.timestamp).toLocaleString(),
        t.total,
        t.paymentMethod,
        t.amountPaid,
        t.change
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatNumber = (value) => {
    return typeof value === 'number' ? value.toFixed(2) : 'N/A';
  };

  const getPaymentMethods = () => {
    return [...new Set(transactions.map(t => t.paymentMethod))].filter(Boolean);
  };

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Transaction Records</CardTitle>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by order number or item name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="min-w-[200px]">
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Methods</SelectItem>
                  {getPaymentMethods().map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                className="border rounded p-2 w-[130px]"
              />
              <Button variant="outline" size="icon" onClick={handleReset}>
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('orderNumber')}>
                    Order # {sortConfig.key === 'orderNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('timestamp')}>
                    Date & Time {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort('total')}>
                    Total {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount Paid</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.orderNumber || 'N/A'}</TableCell>
                      <TableCell>{transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}</TableCell>
                      <TableCell className="text-right">฿{formatNumber(transaction.total)}</TableCell>
                      <TableCell>{transaction.paymentMethod || 'N/A'}</TableCell>
                      <TableCell className="text-right">฿{formatNumber(transaction.amountPaid)}</TableCell>
                      <TableCell className="text-right">฿{formatNumber(transaction.change)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>

        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Details of order #{selectedTransaction?.orderNumber || 'N/A'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <strong>Date & Time: </strong>
                {selectedTransaction?.timestamp ? new Date(selectedTransaction.timestamp).toLocaleString() : 'N/A'}
              </div>
              <div>
                <strong>Payment Method: </strong>
                {selectedTransaction?.paymentMethod || 'N/A'}
              </div>
              <div>
                <strong>Total: </strong>
                ฿{formatNumber(selectedTransaction?.total)}
              </div>
              <div>
                <strong>Amount Paid: </strong>
                ฿{formatNumber(selectedTransaction?.amountPaid)}
              </div>
              <div>
                <strong>Change: </strong>
                ฿{formatNumber(selectedTransaction?.change)}
              </div>
              <div>
                <strong>Items: </strong>
                <ul>
                  {selectedTransaction?.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity} pcs - ฿{formatNumber(item.price)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TransactionRecord;
