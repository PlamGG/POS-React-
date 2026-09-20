import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TransactionRecord from '../components/TransactionRecord';
import { useExpenses, useAddExpense } from '../hooks/useExpenses';

const BillingManagement = () => {
  const { data: expensesList = [], isLoading } = useExpenses();
  const { mutate: addExpense } = useAddExpense();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;
    
    addExpense({
      description,
      amount,
      category,
    });
    
    setDescription('');
    setAmount('');
    setCategory('');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Billing & Expenses</h2>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Sales Transactions</TabsTrigger>
          <TabsTrigger value="expenses">Store Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionRecord />
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
                <CardDescription>Record a store expense</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input 
                      placeholder="e.g. Electricity Bill" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (฿)</label>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Save Expense</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading expenses...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expensesList.map(expense => (
                        <TableRow key={expense.id}>
                          <TableCell>{new Date(expense.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell className="capitalize">{expense.category}</TableCell>
                          <TableCell className="text-right">฿{Number(expense.amount).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      {expensesList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                            No expenses recorded yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingManagement;