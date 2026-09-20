import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Download, Search, FilterX } from 'lucide-react';
import { useTransactions, useVoidTransaction } from '../hooks/useTransactions';

const TransactionRecord = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  const { mutate: voidTransaction } = useVoidTransaction();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 25;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.order_number?.toString().includes(searchTerm) ||
      transaction.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = selectedDate 
      ? new Date(transaction.created_at).toLocaleDateString() === selectedDate.toLocaleDateString() 
      : true;

    const matchesPayment = paymentFilter === 'all' 
      ? true 
      : transaction.payment_method === paymentFilter;

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
    setSortConfig({ key: 'created_at', direction: 'desc' });
  };

  const exportToCSV = () => {
    const headers = ['Order #', 'Date & Time', 'Total', 'Payment Method', 'Amount Paid', 'Change'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.order_number,
        new Date(t.created_at).toLocaleString(),
        t.total,
        t.payment_method,
        t.amount_paid,
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
    return [...new Set(transactions.map(t => t.payment_method))].filter(Boolean);
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('order_number')}>
                    Order # {sortConfig.key === 'order_number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                    Date & Time {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                      <TableCell className="font-medium">
                        {transaction.order_number || 'N/A'}
                        {transaction.status === 'voided' && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">VOID</span>
                        )}
                      </TableCell>
                      <TableCell>{transaction.created_at ? new Date(transaction.created_at).toLocaleString() : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <span className={transaction.status === 'voided' ? 'line-through text-gray-400' : ''}>
                          ฿{formatNumber(transaction.total)}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.payment_method || 'N/A'}</TableCell>
                      <TableCell className="text-right">฿{formatNumber(transaction.amount_paid)}</TableCell>
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
                Details of order #{selectedTransaction?.order_number || 'N/A'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <strong>Date & Time: </strong>
                {selectedTransaction?.created_at ? new Date(selectedTransaction.created_at).toLocaleString() : 'N/A'}
              </div>
              <div>
                <strong>Payment Method: </strong>
                {selectedTransaction?.payment_method || 'N/A'}
              </div>
              <div>
                <strong>Total: </strong>
                ฿{formatNumber(selectedTransaction?.total)}
              </div>
              <div>
                <strong>Amount Paid: </strong>
                ฿{formatNumber(selectedTransaction?.amount_paid)}
              </div>
              <div>
                <strong>Change: </strong>
                ฿{formatNumber(selectedTransaction?.change)}
              </div>
              <div className="max-h-60 overflow-y-auto">
                <strong>Items: </strong>
                <ul className="mt-2 space-y-2">
                  {selectedTransaction?.items?.map((item, index) => (
                    <li key={index} className="bg-slate-50 p-2 rounded-md">
                      <div className="flex justify-between font-medium">
                        <span>{item.quantity}x {item.name}</span>
                        <span>฿{formatNumber(item.price * item.quantity)}</span>
                      </div>
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="text-sm text-gray-500 ml-4">
                          ↳ {item.selectedModifiers.map(m => m.name).join(', ')}
                        </div>
                      )}
                      {item.itemNote && (
                        <div className="text-sm text-orange-500 ml-4 italic">
                          * Note: {item.itemNote}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              {selectedTransaction?.status !== 'voided' ? (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if(window.confirm('Are you sure you want to VOID this transaction? This will refund the stock.')) {
                      voidTransaction(selectedTransaction.id);
                      setSelectedTransaction(null);
                    }
                  }}
                >
                  Void Transaction
                </Button>
              ) : (
                <div className="text-red-500 font-bold px-4 py-2 bg-red-50 rounded-lg">VOIDED</div>
              )}
              <Button onClick={() => window.print()}>Print Receipt</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TransactionRecord;
